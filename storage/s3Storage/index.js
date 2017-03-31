/**
 * Created by ska on 1/15/17.
 */
'use strict';

// import individual service
const
    Storage = require('../index'),
    S3 = require('aws-sdk/clients/s3');

let defaultConfig = {

};

/**
 * function returning promise of s3 response with result converted to {Storage.result}<-TODO
 * @param fn {function} - an s3 method
 * @param params
 * @returns {Promise}
 */
function promiseOfs3Response (fn) {
    return Storage.promiseOf(
        fn,
        resolveArgs => {
            if (resolveArgs && resolveArgs.length)
            return [ Storage.result(true, resolveArgs[0], resolveArgs[0].Body) ];
        },
        err => {
            if (err.code === 'NoSuchKey') {
                return [ Storage.result(false, null, err) ];
            } else {
                return false;
            }
        }
    );
}


/**
 * Class, representing s3 cache storage
 * @extends Storage
 */
class S3Storage extends Storage {
    constructor (cacheId, options, config){
        super(cacheId, options);

        let rconf = {};

        this.s3 = new S3();

        if (typeof config === 'string') {
            this.s3.config.loadFromPath(config);
        } else if (typeof config === 'object') {
            rconf = Object.assign(rconf, defaultConfig, config);
            this.s3.config.update(rconf);
        }

        this.bucket = options.Bucket || config.Bucket;
    }

    put (key, data, options) {
        let params = {
            Bucket: this.bucket,
            Key: key, /* required */
            ACL: 'private', //'private | public-read | public-read-write | authenticated-read | aws-exec-read | bucket-owner-read | bucket-owner-full-control',
            Body: data //new Buffer('...') || 'STRING_VALUE' || streamObject,
            //CacheControl: 'STRING_VALUE',
            //ContentDisposition: 'STRING_VALUE',
            //ContentEncoding: 'STRING_VALUE',
            //ContentLanguage: 'STRING_VALUE',
            //ContentLength: 0,
            //ContentMD5: 'STRING_VALUE',
            //ContentType: 'STRING_VALUE',
            //Expires: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
            //GrantFullControl: 'STRING_VALUE',
            //GrantRead: 'STRING_VALUE',
            //GrantReadACP: 'STRING_VALUE',
            //GrantWriteACP: 'STRING_VALUE',
            //Metadata: {
            //    someKey: 'STRING_VALUE',
            //    /* anotherKey: ... */
            //},
            //RequestPayer: 'requester',
            //SSECustomerAlgorithm: 'STRING_VALUE',
            //SSECustomerKey: new Buffer('...') || 'STRING_VALUE',
            //SSECustomerKeyMD5: 'STRING_VALUE',
            //SSEKMSKeyId: 'STRING_VALUE',
            //ServerSideEncryption: 'AES256 | aws:kms',
            //StorageClass: 'STANDARD | REDUCED_REDUNDANCY | STANDARD_IA',
            //Tagging: 'STRING_VALUE',
            //WebsiteRedirectLocation: 'STRING_VALUE'
        };
        //TODO convert options
        Object.assign(params, options);
        return promiseOfs3Response(this.s3.putObject.bind(this.s3, params));
    };

    get (key, options) {
        let params = {
            Bucket: this.bucket,
            Key: key /* required */
            //IfMatch: 'STRING_VALUE',
            //IfModifiedSince: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
            //IfNoneMatch: 'STRING_VALUE',
            //IfUnmodifiedSince: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
            //PartNumber: 0,
            //Range: 'STRING_VALUE',
            //RequestPayer: 'requester',
            //ResponseCacheControl: 'STRING_VALUE',
            //ResponseContentDisposition: 'STRING_VALUE',
            //ResponseContentEncoding: 'STRING_VALUE',
            //ResponseContentLanguage: 'STRING_VALUE',
            //ResponseContentType: 'STRING_VALUE',
            //ResponseExpires: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
            //SSECustomerAlgorithm: 'STRING_VALUE',
            //SSECustomerKey: new Buffer('...') || 'STRING_VALUE',
            //SSECustomerKeyMD5: 'STRING_VALUE',
            //VersionId: 'STRING_VALUE'
        };

        //TODO convert options
        Object.assign(params, options);
        return promiseOfs3Response(this.s3.getObject.bind(this.s3, params));

        /*
        var stream = s3.getObject(params).createReadStream();

        data = null;
        stream.on('data', function (chunk) {
            data = data?(data+chunk):chunk;
        });
        stream.on('end', callback);

        function callback(err) {
            if (err) return next(err); // an error occurred
            next(null, data);           // successful response
        }

        return stream;
        */
    };
    check (key, options) {
        let params = {
            Bucket: this.bucket,
            Key: key //'STRING_VALUE', // required
            //VersionId: 'STRING_VALUE'
        };
        //if (options.Bucket) params.Bucket = options.Bucket;
        return promiseOfs3Response(this.s3.headObject.bind(this.s3, params));
    };
    remove (key, options) {
        let params = {
            Bucket: this.bucket,
            Key: key //'STRING_VALUE', /* required */
            //MFA: 'STRING_VALUE',
            //RequestPayer: 'requester',
            //VersionId: 'STRING_VALUE'
        };
        return promiseOfs3Response(this.s3.deleteObject.bind(this.s3, params));
    };
}

module.exports = S3Storage;
