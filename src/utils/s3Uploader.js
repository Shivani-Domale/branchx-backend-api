const AWS = require('aws-sdk');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const uploadFileToS3 = async (fileBuffer, originalName, adId) => {
    const extension = path.extname(originalName);
    const fileName = `${uuidv4()}${extension}`;
    const key = `adds/${adId}/${fileName}`;

    const contentType = mime.lookup(extension); // e.g. "image/jpeg" or "video/mp4"
    if (!contentType) {
        throw new Error('Unsupported file type');
    }

    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType, // Adjust based on your file type
        //   ACL: 'public-read' // Optional, if you want the file to be publicly accessible
    };

    await s3.upload(params).promise();

    return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;

};

module.exports = {
    uploadFileToS3
};