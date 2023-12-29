const Aws = require('./aws');

const s3 = new Aws.S3();

const getOrCreateBucket = async (bucketName) => {
    s3.headBucket({Bucket: bucketName}, (err, data) => {
        if (err) {
            const params = {
                Bucket: bucketName
            };

            s3.createBucket(params, (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }

                console.log('Bucket created successfully!');
            });

            return;
        }

        return bucketName;
    });
    return bucketName;
}

const uploadFile = async (bucketName, fileName, fileBuffer) => {
    const params = {
        Bucket: await getOrCreateBucket(bucketName),
        Key: fileName,
        Body: fileBuffer,
    };

    s3.upload(params, (err, data) => {
        if (err) {
            throw new Error(`Upload Failed: ${err.message}`)
        }
    })
}

module.exports = {uploadFile}