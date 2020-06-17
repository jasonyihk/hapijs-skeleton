'use strict';
const Promise = require('promise');
const Crypto = require('crypto');

/**
 * Create instance method for hashing a password
 */
exports.hashPasswordWithSalt = function (password, salt) {
    if(salt) {
        return Crypto.pbkdf2Sync(password, new Buffer(salt, 'base64'), 10000, 64, 'sha512').toString('base64');
    }

    return password;
};

exports.hashPassword = function (password) {
    let salt = Crypto.randomBytes(16).toString('base64');
    let hashPassword = Crypto.pbkdf2Sync(password, new Buffer(salt, 'base64'), 10000, 64, 'sha512').toString('base64');

    return {
        salt: salt,
        hashPassword: hashPassword
    }
};

exports.isPOSServerError = function (body) {
    let ret =  !body || !body.hasOwnProperty('data') || !body.hasOwnProperty('status') ? true : false;
    return ret;
};

exports.isPOSError = function (body) {
    let ret = !body || !body.status || body.status.code !== 0 ? true : false;

    if (ret){
        exports.addPOSTag(body);
    }    
    return ret;
};

exports.addPOSTag = function (body) {
    body.isPOS = true;
};
