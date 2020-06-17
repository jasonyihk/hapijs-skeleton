'use strict';

module.exports = {
    server: {
        host: '0.0.0.0',
        port: process.env.SERVER_PORT || 3000
    },
    basePath: "/member/v1/",
    cors: {
        allowOriginResponse: true,
        maxAge: 600,
    },
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/member?authSource=admin',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoReconnect: true,
            poolSize: 10,
        }
    },
    ignorePathPatterns: ['.*\\/documentation', '.*\\/metrics', '.*\\/swagger'],
    pino: {
        logPayload: true,
        logRequestStart: false,
        logRequestComplete: false,
        level:  process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        redact: process.env.NODE_ENV === 'production' ? ['req.headers.authorization'] : []
    },
    jwtAuthOptions: {
        checkId: process.env.JWT_CHECK_ID || false,
        iss: 'om.auth',
        algorithms: ['RS256'],
        publicKey: process.env.JWT_PUBLIC_KEY || '-----BEGIN PUBLIC KEY-----\n\
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsKJnHNEJh447jNGMwtRg\
E9ckk/MlvAZgzVyQDcqQfp9c47hZJ12XRjxHZhG4y4F/HH0I3OODMnV+jA0DNVQV\
//UjH9+HkN7GMzK6RtaD9wK+nzTd6+dzqaj+2hk/Ybhuv5VRc6FgLjBwxEW3DUYp\
LQIDAQAB\n\
-----END PUBLIC KEY-----'
    },
    basicAuthOptions: [
        {
            app: 'emodel',
            key: process.env.AUTH_BASIC_KEY || '503977657',
            secret: process.env.AUTH_BASIC_SECRET || 'OmV6DXhHyhz53537547OqR'
        }
    ],
    posApi: {
        domain: process.env.POS_DOMAIN || 'https://test.abc.com/interface/restful/dapp',
        'pos.add.distributor.uri': 'POST_/api/v1/addDistributor',
        'pos.verify.sponsor.uri': 'get_/api/v1/verifySponsor',
        'pos.check.members.duplication.uri': 'POST_/api/v1/checkDuplicateMembers',
        timeout: 30*1000
    },
    authApi: {
        domain: process.env.AUTH_DOMAIN || 'http://localhost:5000',
        'auth.service.sign.uri': 'POST_/authService/sign/request',
        timeout: 30*1000
    },
};