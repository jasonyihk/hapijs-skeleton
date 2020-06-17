@Library('om.jenkins.pipeline.library') _

import com.infinitus.*

runPipeline([
	debug: true,
	docker: [
		image: 'member',
		buildPath: './build',
		shouldPush: true,
    registry: ['ecr'],
    project: 'omservice'
	],
	credentials: [          
    bitbucket: ['ssh', 'oauth']
  ],
  require: [
    [
      type: 'bitbucket',
      key: 'ssh',
      path: 'keys/id_rsa'
    ]
  ],
	stages: [
		build: [
			label: 'Build Package',
			run: true,
			script: "echo 'run build'", //"make build"
			tools: [
				NODE: 'N12'
			]
		],
		test: [
			label: 'Test Package',
			run: true,
			script: "echo 'run test'", //"make test",
			tools: [
				NODE: 'N8'
			]
		],
		codeanalysis: [
			label: 'Code Analysis',
			run: true,
			script: "echo 'run test-code-analysis '", //"make test-code-analysis"
		],
		dockerbuild: [
			label: 'Build Docker Image',
			run: true,
			script: "make docker-build"
		],
		dockertest: [
			label: 'Test Docker Image',
			run: true,
			script: "echo 'run docker-test-unit '"//"make docker-test-unit"
		]
	],
	jobProperties: [
		shouldDeployDEV: false,
        shouldDeploySIT: false,
		shouldDeployUAT: false
	]	
]);
