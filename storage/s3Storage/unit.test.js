/**
 * Created by ska on 1/18/17.
 */

const async = require("async");

const //sinon = require('sinon'),
    //mockery = require('mockery'),
    should = require('chai').should();

const
    S3 = require('aws-sdk/clients/s3'),
    s3 = new S3(),
    s3CfgPath = __dirname+'/awsCfg.json';

    s3.config.loadFromPath(s3CfgPath);

const
    Storage = require('./index');
    bucketName = 'cachingtest';


function clearBucket() {
    "use strict";
    let params = {
        Bucket: bucketName
    };
    Storage.promiseOf(done => {
        s3.listObjects(params, function(err, data) {
            async.each(
                data.contents,
                function(object, next){
                    let params = {
                        Bucket: bucketName,
                        Key: object.key
                    };
                    s3.deleteObject(params, function(err, data) {
                        next(err, data);
                    });
                },
                done
            );
        });
    });
}

describe("s3 storage", function() {
    'use strict';

    this.timeout(5000);

    before(async () => {
        await clearBucket();
    });

    after(async () => {
        await clearBucket();
    });

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('put able to put data to s3 bucket', async() => {
        let data = "test data";
        let storage = new Storage( 'cache1', {Bucket: bucketName}, s3CfgPath);
        let result = await storage.put('testKey', data, {});
        result.should.have.property('succeed', true);
        result.storageResponse.should.have.property('ETag', '"eb733a00c0c9d336e65691a37ab54293"');
    });
    
    it('get able to get data to s3 bucket', async() => {
        let data = "test data";
        let storage = new Storage( 'cache1', {Bucket: bucketName}, s3CfgPath);
        let result = await storage.get('testKey', {});
        result.should.have.property('succeed', true);
        result.storageResponse.should.ownProperty('Body');
        should.equal(result.data.toString(), 'test data');
    });
    it('get result has succeed === false when read key which does not exists', async() => {
        let data = "test data";
        let storage = new Storage( 'cache1', {Bucket: bucketName}, s3CfgPath);
        let result = await storage.get('testKeyFake', {});
        result.should.have.property('succeed', false);
        should.not.exist(result.storageResponse);
        //should.not.exist(result.data);
    });


    it('check able to check if key exists in s3 bucket', async() => {
        //let data = "test data";
        let storage = new Storage( 'cache1', {Bucket: bucketName}, s3CfgPath);
        let result = await storage.check('testKey', {});
        result.should.have.property('succeed', true);
        result.storageResponse.should.have.property('ETag', '"eb733a00c0c9d336e65691a37ab54293"');
    });
    it('remove able to remove data on s3 bucket', async() => {
        let storage = new Storage( 'cache1', {Bucket: bucketName}, s3CfgPath);
        let result = await storage.remove('testKey', {});
        result.should.have.property('succeed', true);
    });


});

