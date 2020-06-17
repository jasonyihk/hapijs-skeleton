
'use strict';

const HttpStatusCode = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 503,
}

class BaseError extends Error {
    constructor(name, isServer, code, message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;
        this.code = code ;
        this.isServer = isServer;
        this.message = message;
        this.httpStatusCode = HttpStatusCode.INTERNAL_SERVER;
    }

    toJson = function() {
        return {
            type: this.name,
            code: this.code,
            message: this.message,
            isServer: this.isServer,
            httpStatusCode: this.httpStatusCode
        };
    }
}

class APIError extends BaseError {
    constructor(name, isServer, error) {
        super(name, isServer, error.code, error.message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, APIError);
        }        
        this.stack = error.stack; 
    }
}

class POSError extends BaseError {
    constructor(name = 'POS', body) {
        super(name, true, null, null);

        this.isServer =  !body || !body.hasOwnProperty('data') || !body.hasOwnProperty('status') ? true : false;
        this.isClient =  body.status ? (body.status.code === 0 ? false : true) : true;
        this.code = body.status ? body.status.code : null ;
        this.message = body.status ? body.status.message  : null ;
        this.httpStatusCode = this.isServer ? HttpStatusCode.INTERNAL_SERVER : HttpStatusCode.BAD_REQUEST;
    }
}

module.exports.BaseError = BaseError;
module.exports.APIError = APIError;
module.exports.POSError = POSError;
module.exports.HttpStatusCode = HttpStatusCode;
