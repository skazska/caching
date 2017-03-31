/**
 * Created by ska on 1/18/17.
 */

const async = require("async");

const //sinon = require('sinon'),
    //mockery = require('mockery'),
    should = require('chai').should();

const Redis = require("redis"),
    redisCfg = {db: 15, "return_buffers": true},
    redis = Redis.createClient(redisCfg);

const Storage = require('./index');

function clearDB() {
    "use strict";
    return Storage.promiseOf(done => {
        redis.keys('*', function(err, keys) {
            async.each(
                keys,
                function(key, next){
                    redis.del(key, function(err, data) {
                        next(err, data);
                    });
                },
                done
            );
        });
    });
}

describe("redis storage", function() {
    'use strict';

    this.timeout(5000);

    before(async () => {
        await clearDB();
    });

    after(async () => {
        await clearDB();
    });

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('put able to put data to redis, result have succeed===true and has storageResponse', async () => {
        let data = "test data";
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.put('testKey', data, options);
        result.should.have.property('succeed', true);
        result.storageResponse.toString().should.equal('OK');
    });

    it('put existing key with ifNotExists option should fail', async () => {
        let data = "test data 2";
        let options = {ifNotExists: true};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.put('testKey', data, options);
        result.should.have.property('succeed', false);
        should.not.exist(result.storageResponse);
    });

    it('put nonexisting key with ifExists option should fail', async () => {
        let data = "test data 3";
        let options = {ifExists: true};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.put('testKeyFake', data, options);
        result.should.have.property('succeed', false);
        should.not.exist(result.storageResponse);
    });


    it('get able to get data from redis, result have succeed===true and has storageResponse', async () => {
        let data = "test data";
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.get('testKey', options);
        result.should.have.property('succeed', true);
        result.data.toString().should.equal(data);
        result.storageResponse.toString().should.equal(data);
    });

    it('get result have succeed===false and has storageResponse if no such key', async () => {
        let data = "test data";
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.get('testKeyFake', options);
        result.should.have.property('succeed', false);
        should.not.exist(result.data);
        should.not.exist(result.storageResponse);
    });

    it('check able to know if key exists in redis, result have succeed===true and has storageResponse', async () => {
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.check('testKey', options);
        result.should.have.property('succeed', true);
        result.storageResponse.should.equal(1);
    });

    it('check result have succeed===false and has storageResponse if no such key', async () => {
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.check('testKeyFake', options);
        result.should.have.property('succeed', false);
    });

    it('remove able to remove data on redis, result have succeed===true and has storageResponse', async () => {
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.remove('testKey', options);
        result.should.have.property('succeed', true);
        result.storageResponse.should.equal(1);
    });

    it('remove result has succeed === false when try remove key which not exists', async () => {
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.remove('testKeyFake', options);
        result.should.have.property('succeed', false);
        result.storageResponse.should.equal(0);
    });

    it('able to remove data set with ttl on redis', async function(){
        this.timeout(8000);
        let data = "test data";
        let options = {ttl: 2000};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.put('testKey', data, options);
        result.should.have.property('succeed', true);

        result = await new Promise(resolve => {
            setTimeout(async () => {
                resolve(await storage.get('testKey', options));
            }, 3000);
        });
        result.should.have.property('succeed', false);
        should.not.exist(result.data);
        should.not.exist(result.storageResponse);
    });


});
