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

    it('put able to put data to redis', async () => {
        let data = "test data";
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.put('testKey', data, options);
        result.toString().should.equal('OK');
    });

    it('get able to get data from redis', async () => {
        let data = "test data";
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.get('testKey', options);
        result.toString().should.equal(data);
    });

    it('check able to know if key exists in redis', async () => {
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.check('testKey', options);
        result.toString().should.equal('1');
    });

    it('remove able to remove data on redis', async () => {
        let options = {};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.remove('testKey', options);
        result.toString().should.equal('1');
    });

    it('able to remove data set with ttl on redis', async function(){
        this.timeout(8000);
        let data = "test data";
        let options = {ttl: 2000};
        let storage = new Storage('cache1', {}, redisCfg);
        let result = await storage.put('testKey', data, options);
        result.toString().should.equal('OK');

        result = await new Promise(resolve => {
            setTimeout(async () => {
                resolve(await storage.get('testKey', options));
            }, 3000);
        });
        should.not.exist(result);
    });


});
