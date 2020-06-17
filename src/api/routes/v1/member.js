'use strict';

const Config = require('config/config');
const basePath = Config.basePath;

exports.plugin = {
    pkg: require('../../../../package.json'),
    name : 'member_routes_v1',
    register: async (plugin, options) => {
        const Controllers = {
            member: require('api/controllers/member')
        };

        plugin.route([
            {
                method: 'GET',
                path: basePath + 'sponsor/{sponsorId}',
                config: Controllers.member.getSponsorInfo
            },
            {
                method: 'POST',
                path: basePath + 'register',
                config: Controllers.member.register
            },
            {
                method: 'POST',
                path: basePath + 'checkDuplicates',
                config: Controllers.member.checkDuplicates
            },
        ]);
    }
};
