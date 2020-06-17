DBG_MAKEFILE ?=
ifeq ($(DBG_MAKEFILE),1)
    $(warning ***** starting Makefile for goal(s) "$(MAKECMDGOALS)")
    $(warning ***** $(shell date))
else
	# If we're not debugging the Makefile, don't echo recipes.
	MAKEFLAGS += -s
endif

SHELL := /bin/bash
MAKEFLAGS += --no-builtin-rules

ifndef NAMESPACE
$(warning NAMESPACE are not set, [DEV] used as default)
endif

.EXPORT_ALL_VARIABLES:
APP_NAME = member
DEPLOY_DIR = ./deploy
BUILD_DIR = ./build
IMAGE_TAG ?= $(shell git rev-parse --short=8 HEAD)
DOCKER_DIR := $(DEPLOY_DIR)/bin
NAMESPACE ?= dev
TRAEFIK_NAMESPACE ?= traefik
ECR = 123456789.dkr.ecr.ap-southeast-1.amazonaws.com
TLS = false
SSL = lkkhpgdi-ssl-cert-secret
REPLICAS = 1

ifneq (,$(filter uat stag prod, $(NAMESPACE)))
  	TRAEFIK_NAMESPACE = traefik-$(NAMESPACE)
endif

$(info    TRAEFIK_NAMESPACE is $(TRAEFIK_NAMESPACE))

ifneq (,$(filter stag prod, $(NAMESPACE)))
	ECR = 987654321.dkr.ecr.ap-southeast-1.amazonaws.com
	SSL = linfservice-ssl-cert-secret
endif

DOMAIN = apigw-$(NAMESPACE).lkkhpgdi.com
NGINX_CLASS = traefik
ifneq (,$(filter sit qas, $(NAMESPACE)))
  	DOMAIN = apigw.$(NAMESPACE).lkkhpgdi.com
else ifneq (,$(filter stag, $(NAMESPACE)))
	DOMAIN = apigw-staging.linfservice.com  
else ifneq (,$(filter prod, $(NAMESPACE)))
	DOMAIN = apigw.linfservice.com
	REPLICAS = 2
endif

DOCKER_FILE ?= Dockerfile
DOCKER_FILE_TEST ?= Dockerfile.test

.PHONY: clean docker-clean
.PHONY: test-code-analysis test-unit test-integration
.PHONY: build kube-build kube-deploy kube-clean
.PHONY: docker-build docker-test docker-build-test

define BUILD_KUBE_FILE
	mkdir -p $(BUILD_DIR)/$(NAMESPACE) ; 
	for file in $(DEPLOY_DIR)/kube/*.yaml ; do \
		newFile=$$(basename "$$file") ; \
		sed "s/{{NAMESPACE}}/$(TRAEFIK_NAMESPACE)/g; s:{{ECR}}:$(ECR):g; s/{{DOMAIN}}/$(DOMAIN)/g; \
      		s/{{NGINX_CLASS}}/$(NGINX_CLASS)/g; s/{{IMAGE_TAG}}/$(IMAGE_TAG)/g; s/{{SSL}}/$(SSL)/g; \
		 	s/{{TLS}}/$(TLS)/g; s/{{REPLICAS}}/$(REPLICAS)/g; \
		" $$file > $(BUILD_DIR)/$(NAMESPACE)/$(APP_NAME)-$$newFile ; \
	done ;

	#generate secret
	secretFile=$(BUILD_DIR)/$(NAMESPACE)/$(APP_NAME)-secret.yaml ; \
	cat $(DEPLOY_DIR)/process.json \
		| jq '.["kube_$(NAMESPACE)"]' \
		| jq -r 'to_entries \
		| map("  \(.key): " + @base64 "\(.value)")|.[]' \
	>> $$secretFile
endef

clean:
	rm -rf $(BUILD_DIR)

build:
	npm install
	npm audit fix

test-code-analysis:
	@echo "code analysis will be implemented in the future"

test-unit:
	@echo "unit test will be implemented in the future"
	#npm run test

kube-build:
	$(call BUILD_KUBE_FILE)

kube-clean:
	rm -rf $(BUILD_DIR)/$(TRAEFIK_NAMESPACE)

docker-clean:
	if [ -n "$(docker image ls | grep $(APP_NAME):$(IMAGE_TAG))" ]; then docker image rmi $(APP_NAME):$(IMAGE_TAG); fi

docker-build:
	docker build --network=host -f $(DOCKER_FILE) -t $(APP_NAME):$(IMAGE_TAG) .

docker-test-unit:
	mkdir -p build/
	tag=$$(git rev-parse --short=8 HEAD) ; \
	sed "s/{{IMAGE_TAG}}/$$tag/g;" $(DOCKER_FILE_TEST) > $(BUILD_DIR)/$(DOCKER_FILE_TEST) ; \
	docker build --network=host -f $(BUILD_DIR)/$(DOCKER_FILE_TEST) -t $(APP_NAME):$$tag-test .
