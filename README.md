**this is a pre-alpha**

Caching is to use s3 or redis storage services to cache data by key.

Supports methods:
* put - stores data by key
* get - retrieves data by key
* check - check if key has data in storage
* remove - removes data by key

works with:
* aws s3
* redis

##Usage (Redis)
    Storage = require('@skazska/caching');
    redisCfg = {db: 15},
    const cache = new Storage.Redis('cacheId-ToDo(no meaning now)', {ttl: 5000/*default options*/}, redisCfg);
    async function test() {
        try {
            let result = await cache.put('myData', 'Hi There', {ttl: 30000, ifNotExists: true});
            if (result.toString() == 'OK') console.log('success')       
        } catch(e) {
            console.error(e);
        }
    }
    
##Usage (S3)
    Storage = require('@skazska/caching');
    s3Cfg = {
        "accessKeyId": "AWSACCESSKEY1",
        "secretAccessKey": "aws435secret4264key32526",
        "region": "aws-region"
    },
    const cache = new Storage.S3('cacheId-ToDo(no meaning now)', {Bucket: 'bucketName'}, s3Cfg);
    async function test() {
        try {
            let result = await cache.put('myData', 'Hi There', {});
            if (!!result) console.log('success, ETag:', result.ETag);       
        } catch(e) {
            console.error(e);
        }
    }
