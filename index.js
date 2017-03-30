/**
 * Created by ska on 1/15/17.
 */
'use strict';

const Storage = require('./storage');
const RedisStorage = require('./storage/redisStorage');
const S3Storage = require('./storage/s3Storage');

/**
 * Caching.
 * @module @timuchin/caching
 */

module.exports = {
    /** Abstract cache **/
    Storage: Storage,
    /** Redis cache **/
    Redis: RedisStorage,
    /** s3 cache **/
    S3: S3Storage,
};