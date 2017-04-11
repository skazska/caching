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

    it('put able to put data to redis, result have success===true and has storageResponse', async () => {
        let data = "test data";
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.put('testKey', data, options);
        result.should.have.property('success', true);
        result.storageResponse.toString().should.equal('OK');
    });

    it('put existing key with ifNotExists option should fail', async () => {
        let data = "test data 2";
        let options = {ifNotExists: true};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.put('testKey', data, options);
        result.should.have.property('success', false);
        should.not.exist(result.storageResponse);
    });

    it('put nonexisting key with ifExists option should fail', async () => {
        let data = "test data 3";
        let options = {ifExists: true};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.put('testKeyFake', data, options);
        result.should.have.property('success', false);
        should.not.exist(result.storageResponse);
    });


    it('get able to get data from redis, result have success===true and has storageResponse', async () => {
        let data = "test data";
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.get('testKey', options);
        result.should.have.property('success', true);
        result.data.toString().should.equal(data);
        result.storageResponse.toString().should.equal(data);
    });

    it('get result have success===false and has storageResponse if no such key', async () => {
        let data = "test data";
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.get('testKeyFake', options);
        result.should.have.property('success', false);
        should.not.exist(result.data);
        should.not.exist(result.storageResponse);
    });


    it('list able to get list of keys from redis, result have success===true and has storageResponse', async () => {
        let data = "test data";
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let putResult = await storage.put('testKeyForList', data, options);
        putResult.should.have.property('success', true);
        let result = await storage.list('test*', options);
        result.should.have.property('success', true);
        should.equal(result.data.length, 2);
        result.data[1].should.equal('testKeyForList');
        should.exist(result.storageResponse.length);
    });


    it('check able to know if key exists in redis, result have success===true and has storageResponse', async () => {
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.check('testKey', options);
        result.should.have.property('success', true);
        result.storageResponse.should.equal(1);
    });

    it('check result have success===false and has storageResponse if no such key', async () => {
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.check('testKeyFake', options);
        result.should.have.property('success', false);
    });

    it('remove able to remove data on redis, result have success===true and has storageResponse', async () => {
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.remove('testKey', options);
        result.should.have.property('success', true);
        result.storageResponse.should.equal(1);
    });

    it('remove result has success === false when try remove key which not exists', async () => {
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.remove('testKeyFake', options);
        result.should.have.property('success', false);
        result.storageResponse.should.equal(0);
    });

    it('put & get jsObject', async () => {
        let data = {key: "value"};
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.put('testKeyJS', data, options);
        result.should.have.property('success', true);
        result = await storage.get('testKeyJS', data, options);
        result.should.have.property('success', true);

    });

    it('able to remove data set with ttl on redis', async function(){
        this.timeout(8000);
        let data = "test data";
        let options = {ttl: 2000};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.put('testKey', data, options);
        result.should.have.property('success', true);

        result = await new Promise(resolve => {
            setTimeout(async () => {
                resolve(await storage.get('testKey', options));
            }, 3000);
        });
        result.should.have.property('success', false);
        should.not.exist(result.data);
        should.not.exist(result.storageResponse);
    });


});
