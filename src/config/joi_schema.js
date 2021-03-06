'use strict';

const joi = require('@hapi/joi');

const duplicateSchema = joi.object({
    market: joi.string().max(15).required().description('market'),
    memberRole: joi.string().allow('').required().description('member role'),
    idNumber: joi.string().allow('').optional().description('personal id number'),
    idType: joi.string().allow('').optional().description('id type'),
    mobileAreaCode: joi.string().allow('').optional().description('area code'),
    mobileNumber: joi.string().allow('').optional().description('mobile number'),
    email: joi.string().allow('').optional().description('email'),
    firstNameChn: joi.string().allow('').optional().description('first name in Chinese'),
    lastNameChn: joi.string().allow('').optional().description('last name in Chinese'),
    firstNameEng: joi.string().allow('').optional().description('first name in English'),
    lastNameEng: joi.string().allow('').optional().description('last last name in English'),
}).unknown(true).optional();

const registerSchema = joi.object({
    appNo: joi.string().max(40).required().description('app no'),
    market: joi.string().max(15).required().description('market'),
    sponsorId: joi.string().max(50).required().description('parent distributor id'),
    firstNameChn: joi.string().allow('').description('first name in Chinese'),
    lastNameChn: joi.string().allow('').description('last name in Chinese'),
    firstNameEng: joi.string().allow('').description('first name in English'),
    lastNameEng: joi.string().allow('').description('last last name in English'),
    username: joi.string().allow('')
        .regex(/^(?![0-9]*$)[a-zA-Z0-9]{3,20}$/)
        .description('username for oauth2'),
    usernameReferenceId: joi.string().when(
        'username', {
            is: /^(?![0-9]*$)[a-zA-Z0-9]{3,20}$/,
            then: joi.required()
        }
    ).description('when there is username, the usernameReferenceId is required'),
    memberRole: joi.string().max(5).required().description('member role'),
    memberType: joi.string().required().description('member type'),
    idType: joi.string().required().description('id type'),
    idNumber: joi.string().max(25).allow('').optional().description('personal id number'),
    birthday: joi.string().allow('').description('birthday(yyyy-MM-dd)'),
    gender: joi.string().allow('').description('gender'),
    companyName: joi.string().allow('').description('company name'),
    companyIdNumber: joi.string().allow('').description('company id number'),
    language: joi.string().allow('').description('language'),
    eshopUrl: joi.string().optional().allow('').description('Ehsop URL'),
    education: joi.string().allow('').description('education'),
    race: joi.string().allow('').description('race'),
    nationality: joi.string().allow('').description('nationality'),
    password: joi.string().optional().allow('').description('password'),
    passcodeRuleVersion: joi.string().optional().default('v1').description('passcode rule version'),
    perCountry: joi.string().allow('').description('personal address - country'),
    perState: joi.string().allow('').description('personal address - state'),
    perCity: joi.string().allow('').description('personal address - city'),
    perAddress: joi.string().allow('').description('personal address - detail address'),
    perAddress2: joi.string().allow('').description('personal address - detail address2'),
    perAddress3: joi.string().allow('').description('personal address - detail address3'),
    perZipCode: joi.string().allow('').description('personal address - zip code'),
    curCountry: joi.string().allow('').description('contact address – country'),
    curState: joi.string().allow('').description('contact address - state'),
    curCity: joi.string().allow('').description('contact address - city'),
    curAddress: joi.string().allow('').description('contact address - detail address'),
    curAddress2: joi.string().allow('').description('contact address - detail address2'),
    curAddress3: joi.string().allow('').description('contact address - detail address3'),
    curZipCode: joi.string().allow('').description('contact address - zip code'),
    taxCountry: joi.string().allow('').description('tax address – country'),
    taxState: joi.string().allow('').description('tax address - state'),
    taxCity: joi.string().allow('').description('tax address - city'),
    taxAddress: joi.string().allow('').description('tax address - detail address'),
    taxAddress2: joi.string().allow('').description('tax address - detail address2'),
    taxAddress3: joi.string().allow('').description('tax address - detail address3'),
    taxZipCode: joi.string().allow('').description('tax address - zip code'),
    phoneNumberAreaCode: joi.string().allow('').description('area code'),
    phoneNumber: joi.string().allow('').description('home telephone'),
    mobileAreaCode: joi.string().allow('').description('area code'),
    mobileNumber: joi.string().allow('').description('mobile number'),
    emailAddress: joi.string().allow('').email().description('email'),
    payeeName: joi.string().allow('').description('payee name'),
    bankCode: joi.string().allow('').description('bank code'),
    bankAccount: joi.string().allow('').description('bank account'),
    bankAccountIdNumber: joi.string().allow('').description('bank account id number'),
    bonusPaymentMethod: joi.string().allow('').description('bank, check'),
    spouseFirstNameChn: joi.string().allow('').description('spouse first name chinese'),
    spouseLastNameChn: joi.string().allow('').description('spouse last name chinese'),
    spouseFirstNameEng: joi.string().allow('').description('spouse first name english'),
    spouseLastNameEng: joi.string().allow('').description('spouse last name english'),
    spouseIDType: joi.string().allow('').description('spouse id type'),
    spouseID: joi.string().allow('').description('spouse id'),
    spouseBirthday: joi.string().allow('').description('spouse birthday(yyyy-MM-dd)'),
    beneficiaryFirstNameChn: joi.string().allow('').description('beneficiary first name chinese'),
    beneficiaryLastNameChn: joi.string().allow('').description('beneficiary last name chinese'),
    beneficiaryFirstNameEng: joi.string().allow('').description('beneficiary first name english'),
    beneficiaryLastNameEng: joi.string().allow('').description('beneficiary last name english'),
    beneficiaryIDType: joi.string().allow('').description('beneficiary id type'),
    beneficiaryID: joi.string().allow('').description('beneficiary id'),
    beneficiaryBirthday: joi.string().allow('').description('beneficiary birthday(yyyy-MM-dd)'),
    beneficiaryRelationship: joi.string().allow('').description('relationship with beneficiary'),
    promotionOptIn: joi.string().allow('').description('advertisement option'),
    registerationChannel: joi.string().allow('').description('registration channel'),
    travelPlanMonth: joi.string().allow('').description('travelPlanMonth'),
    onlinePayoutAccount: joi.string().max(255).allow('').description('onlinePayoutAccount'),
}).unknown(true).optional();

exports.registerSchema = registerSchema;
exports.duplicateSchema = duplicateSchema;