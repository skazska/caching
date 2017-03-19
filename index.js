/**
 * Created by ska on 1/15/17.
 */
'use strict';

const RedisStorage = require('./storage/redisStorage');
const S3Storage = require('./storage/s3Storage');



module.exports = {
    Redis: RedisStorage,
    S3: S3Storage,
};