/**
 * Created by ska on 1/15/17.
 */
//'use strict';

//import Storage from '../index';

const
    Storage = require('../index'),
    Redis = require("redis"),
    defaultConfig = {"return_buffers": true};

/**
 * Class, representing Redis cache storage
 * @extends Storage
 */
class RedisStorage extends Storage {

    _defineSet () {
        this._isNew = new Promise(async (resolve, reject)=>{
            try {
                let info = await this.info('server');
                let ver = /redis_version:([0-9.]+)/.exec(info);
                resolve(ver && ver[1] >= '2.6.12')
            } catch(e) {
                reject(e); // 30
            }
        });
        return this._isNew;
    }

    _setNew (key, data, options) {
        return Storage.promiseOf((next) => {
            let args = [key, data];
            if (options.ttl) {
                args.push('PX');
                args.push(options.ttl);
            }
            if (options.ifExists) {
                args.push('XX');
            }
            this.redis.set(args, next);
        });
    }

    _setOld (key, data, options) {
        return Storage.promiseOf((next) => {
            if (options.ifNotExists) {
                this.redis.send_command('setnx', [key, data], (err, res) => {
                    if (err) return next(err);
                    if (options.ttl) {
                        if (res) return this.redis.send_command('pexpire', [key, options.ttl], next);
                    }
                    next(null, 'OK');
                });
            } else if (options.ttl) {
                this.redis.send_command('psetex', [key, options.ttl, data], next);
            } else {
                this.redis.set(key, data, next);
            }

        });
    }


    async _set (key, data, options) {
        let isNew = await this._isNew;
        return isNew?this._setNew(key, data, options):this._setOld(key, data, options)
    }

    constructor (cacheId, options, config) {
        super(cacheId, options);
        //var self = this;
        let rconf = {};
        rconf = Object.assign(rconf, defaultConfig, config);

        this.redis = Redis.createClient(rconf);

        //this._dispatchStorageEvents(this.redis, 'error, connect->connected, reconnecting->disconnected, end');

        this._defineSet();

    }

    info (category) {
        return new Promise((resolve, reject) => {
            this.redis.info(category, (err, info) => {
                if (err) return reject(err);
                if (Buffer.isBuffer(info)) info = info.toString();
                return resolve(info);
            });

        });
    }

    put (key, data, options) {
        return new Promise(resolve => {
            if (data.pipe && data.on) {
                let buffer;
                data.on('data', (chunk) => {
                    buffer = buffer ? (buffer + chunk) : chunk;
                });
                data.on('end', () => {
                    resolve(this._set(key, buffer, options));
                });
            } else {
                resolve(this._set(key, data, options));
            }
        });
    }

    get (key, options, next) {
        return Storage.promiseOf((next)=>{
            this.redis.get(key, next);
        });
    }

    check (key, options, next) {
        return Storage.promiseOf((next)=> {
            this.redis.exists(key, next);
        });
    }

    remove (key, options, next) {
        return Storage.promiseOf((next)=> {
            this.redis.del(key, next);
        });
    }
}

module.exports = RedisStorage;
