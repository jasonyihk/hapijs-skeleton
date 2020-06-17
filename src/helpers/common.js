'use strict';

const Promise = require('promise');

exports.isMemberExistByEmail = async (email, market) => {
    return new Promise(async function (resolve, reject) {
        try {
            let query = {};

            query['email']= {$regex: '^' + exports.escapeRegExp(email.toLowerCase()) + '$', $options: 'si'};
             
            console.log(query)
            if(market) {
                query['market']= market;
            }

            let member = await Member.findOne(query);

            if (member) {
                return resolve(member);
            }
            return resolve();
        } catch (error) {
            return reject(error);
        }
    });
};

exports.isMemberExistById =  async (memberId) => {
    return new Promise(async function (resolve, reject) {
        try {
            let member = await Member.findOne({
                memberId: memberId
            });

            if (member) {
                return resolve(member);
            }
            return resolve();
        } catch (error) {
            return reject(error);
        }
    });
};

exports.isAddressExistByName = async (addressName) => {
    return new Promise(async function (resolve, reject) {
        try {
            let address = await Member.findOne(
                {
                    address: { $elemMatch: { name: addressName} }
                },
                {address: 1}
            );

            if (address) {
                return resolve(address);
            }
            return resolve();
        } catch (error) {
            return reject(error);
        }
    });
}

exports.isAddressExistById = async (addressId) => {
    return new Promise(async function (resolve, reject) {
        try {
            let address = await Member.findOne(
                {
                    address: { $elemMatch: { addressId: addressId} }
                },
                {address: 1}
            );

            if (address) {
                return resolve(address);
            }
            return resolve();
        } catch (error) {
            return reject(error);
        }
    });
}

exports.escapeRegExp = (text) => {
    return text.replace(/[-[\]{}()*+!?.,\\^$|#\s]/g, '\\$&');
}

exports.hasAsiaChars = (text) => {
    if(!text) return false;
    return text.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/);
}

exports.toDisplayFullName = (firstName, lastName) => {
    let fullName = firstName + ' ' + lastName;
    if (firstName || lastName) {
        if (exports.hasAsiaChars(firstName) || exports.hasAsiaChars(lastName) ) {
            fullName = lastName + firstName;
        }
    }
    return fullName;
}