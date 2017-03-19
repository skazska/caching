/**
 * Created by ska on 3/3/17.
 */
const EventEmitter = require('events').EventEmitter;

class Storage { //extends EventEmitter {
    constructor (cacheId, options) {
        //super();
        this.cacheId = cacheId;
        this.options = options;
    }

    static promiseOf (fn){
        return new Promise((resolve, reject) => {
            fn(function(err, ...res){
                if (err) return reject(err);
                return resolve.apply(this, res);
            })
        });
    }

    /*
    _error (...args) {
        this.emit('error', args);
    }
    _initialized (...args) {
        this.emit('initialized', args);
    }

    _connected (...args) {
        this.emit('connected', args);
    }

    _disconnected (...args) {
        this.emit('disconnected', args);
    }

    _end (...args) {
        this.emit('end', args);
    }

    _dispatchStorageEvent(storage, storageEvent, event) {
        const self = this;
        if (typeof event !== 'string') return false;
        let methodName = '_'+event;
        if (typeof self[methodName] !== 'function') return false;
        storage.on(storageEvent, function(...args){
            self[methodName].apply(self, [this].concat(args));
        });
        return true;
    }

    _dispatchStorageEvents(storage, events) {
        let list = events;
        if (typeof events === 'string') list = events.split(',').map(def => {
           def = def.trim();
           let sides = def.split('->');
           return {event: sides[0], storageEvent: sides[1]||sides[0]};
        });
        if (typeof list.forEach !== 'function') return false;
        let res = [];
        list.forEach(item => {
            if (this._dispatchStorageEvent(storage, item.storageEvent, item.event)) res.push(item);
        });
        return res;
    }

    */

    _emptyMethod () {
        return Promise.reject(new Error('Method is not implemented'));
    }

    put (key, data, options) {
        return this._emptyMethod();
    }

    get (key, options) {
        return this._emptyMethod();
    }

    check (key, options) {
        return this._emptyMethod();
    }

    remove (key, options) {
        return this._emptyMethod();
    }


}

module.exports = Storage;