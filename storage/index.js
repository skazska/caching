/**
 * Created by ska on 3/3/17.
 */
//const EventEmitter = require('events').EventEmitter;

/**
 * @callback PromiseWrappedFunction
 * @param fn {NodeJSCallback}
 */

/**
 * @callback NodeJSCallback
 * @param err {error} error instance
 * @param result {*} return data
 */

/**
 * Class representing abstract cache storage
 * @abstract
 */
class Storage {
    /**
     * Creates storage
     * @param {string} [cacheId] -  string to be used by storage implementation as logical separator for different caches in one storage
     * @param {object} [options] - options hash to be used by storage implementation
     */
    constructor (cacheId, options) {
        //super();
        this.cacheId = cacheId;
        this.options = options;
    }

    /**
     * returns an instance of Promise wrapper of node callback style function
     * @param {PromiseWrappedFunction} fn
     * @returns {Promise}
     */
    static promiseOf (fn){
        return new Promise((resolve, reject) => {
            fn(function(err, ...res){
                if (err) return reject(err);
                return resolve.apply(this, res);
            })
        });
    }

    _emptyMethod () {
        return Promise.reject(new Error('Method is not implemented'));
    }

    /**
     * put data identified by key to storage
     * @abstract
     * @param {string} key
     * @param {*} data
     * @param {object} options
     * @returns {Promise}
     */
    put (key, data, options) {
        return this._emptyMethod();
    }

    /**
     * get stored data by key
     * @abstract
     * @param {string} key
     * @param {object} options
     * @returns {Promise}
     */
    get (key, options) {
        return this._emptyMethod();
    }

    /**
     * check if storage contains any data with key
     * @abstract
     * @param {string} key
     * @param {object} options
     * @returns {Promise}
     */
    check (key, options) {
        return this._emptyMethod();
    }

    /**
     * removes stored data by key
     * @abstract
     * @param {string} key
     * @param {object} options
     * @returns {Promise}
     */
    remove (key, options) {
        return this._emptyMethod();
    }


}

module.exports = Storage;