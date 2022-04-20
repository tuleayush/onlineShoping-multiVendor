const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { aws_s3 } = require('./environment');

const s3 = new aws.S3({
    region: 'us-east-1',
    accessKeyId: aws_s3.accessKeyId,
    secretAccessKey: aws_s3.secretAccessKey
});

module.exports = {
    uploadS3: multer({
        storage: multerS3({
            s3: s3,
            bucket: aws_s3.bucket,
            acl: 'public-read',
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
                cb(null, `${file.fieldname}/${Date.now().toString()}_${file['originalname']}`);
            }
        })
    }),
    // deleteS3File: (filepath, cb) => {
    //     var params = {
    //         Bucket: aws_s3.S3_NAME,
    //         Key: filepath
    //     };
    //     s3.deleteObject(params, function (err, data) {
    //         if (data) cb(null, 'File Deleted Successfully !');
    //         else cb(err, 'Check if you have sufficient permissions');
    //     });
    // },
    // uploadS3File: (body, filepath, cb) => {
    //     var params = {
    //         Bucket: aws_s3.S3_NAME,
    //         Key: filepath,
    //         Body: body,
    //         ACL: 'public-read'
    //     };
    //     s3.upload(params, function (err, data) {
    //         if (data) cb(null, data);
    //         else cb(err, 'Check if you have sufficient permissions');
    //     });
    // },
};
