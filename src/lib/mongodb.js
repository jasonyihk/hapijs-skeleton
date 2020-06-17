'use strict';

const Mongodb = require('mongodb');
const MongoClient = Mongodb.MongoClient;
const ObjectID = Mongodb.ObjectID;
const Config = require('../config/node_modules/config/config');
const MONGODB_OPTION = Config.mongodb.options;

exports.plugin = {  
    async register (server, options) {
        const expose = {
            lib: Mongodb,
            ObjectID
        };

        const connect = async function (connectionOptions) {
            const client = await MongoClient.connect(options.uri, connectionOptions);
            const db = await client.db();

            const connectionOptionsToLog = Object.assign({}, connectionOptions, {
                url: options.uri.replace( /mongodb:\/\/([^/]+):([^@]+)@/, 'mongodb://$1:******@')
            });
            console.log(['mongodb', 'info'], 'MongoDb connected to ' + JSON.stringify(connectionOptionsToLog));

            expose.db = db;
            expose.client = client;
            expose.getDb = getDb;
        };

        const disconnect = async function () {
            expose.client.close((err) => console.log(['disconnect mongodb', 'error'], err));
            console.log('mongodb disconnected');
        };

        const getDb = async function () {
            if(!db) {
                await connect(MONGODB_OPTION);
            }
            return db;
        };

        await connect(MONGODB_OPTION);

        server.decorate('server', 'mongo', expose);
        server.decorate('request', 'mongo', expose);

        expose.db.on('authenticated', () => {
            console.info(`mongoDB connected to ${options.uri}`);
        });

        expose.db.on('error', err => {
            console.error(`mongoDB encountered error: ${err.message}`);
        });

        expose.db.on('reconnect', () => {
            console.warn('mongoDB reconnected');
        });

        expose.db.on('close', () => {
            console.warn('mongoDB connection is closing');
            disconnect();
        });

        expose.db.on('disconnect', () => {
            console.error('mongoDB is disconnecting');
            disconnect();
        });


    },
    pkg: require('../../package.json'),
    name : 'mongodb'
};