**this is a pre-alpha**

Caching is to use s3 or redis storage services to cache data by key.
(Node 7.7.2 or higher is required, using ES 2017 builtin features)

Supports methods:
* put - stores data by key
* get - retrieves data by key
* list - retrieves list of data keys
* check - check if key has data in storage
* remove - removes data by key

Static helper method:
* Storage.promiseOf - return promise of function with nodejs callback

works with:
* aws s3
* redis

**Usage (Redis)**
```javascript
    Storage = require('@skazska/caching');
    redisCfg = {db: 15};
    const cache = new Storage.Redis('cacheId-ToDo(no meaning now)', {ttl: 5000/*default options*/}, redisCfg);
    async function test() {
        try {
            let result = await cache.put('myData', 'Hi There', {ttl: 30000, ifNotExists: true});
            if (result.success) console.log('success');
            result = await cache.get('myData');
            if (result.success) console.log(result.data.toString());
            result = await cache.list('my*');
            if (result.success) result.data.forEach(key => { console.log(key).toString() });
        } catch(e) {
            console.error(e);
        }
    }
```
**Usage (S3)**
```javascript
    Storage = require('@skazska/caching');
    s3Cfg = {
        "accessKeyId": "AWSACCESSKEY1",
        "secretAccessKey": "aws435secret4264key32526",
        "region": "aws-region"
    };
    const cache = new Storage.S3('cacheId-ToDo(no meaning now)', {Bucket: 'bucketName'}, s3Cfg);
    async function test() {
        try {
            let result = await cache.put('myData', 'Hi There', {});
            if (result.success) console.log('success');
            result = await cache.get('myData');
            if (result.success) console.log(result.data.toString());
            result = await cache.list('my');
            if (result.success) result.data.forEach(key => { console.log(key).toString() });
        } catch(e) {
            console.error(e);
        }
    }
```