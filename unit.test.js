/**
 * Created by ska on 3/22/17.
 */

const
    Storage = require('./index'),
    //sinon = require('sinon'),
    //mockery = require('mockery'),
    should = require('chai').should();

describe("caching exports", function() {
    'use strict';

    it('should export RedisStorage', async () => {
        should.exist(Storage.Redis);
    });

    it('should export S3Storage', () => {
        should.exist(Storage.S3)
    });

});