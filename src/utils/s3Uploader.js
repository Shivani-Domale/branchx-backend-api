const AWS = require('aws-sdk');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');

// Initialize S3
const s3 = new AWS.S3({
  accessKeyId: process.env?.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env?.AWS_SECRET_ACCESS_KEY,
  region: process.env?.AWS_REGION
});

const BUCKET_NAME = process.env?.AWS_S3_BUCKET_NAME;

 const uploadToS3 = async (files, adId) => {
  const inputFiles = Array.isArray(files) ? files : [files];

  const uploadTasks = inputFiles?.map((file) => {
    const extension = path.extname(file?.originalname || '');
    const fileName = `${uuidv4()}${extension}`;
    const key = `adds/${adId}/${fileName}`;
    const contentType = mime.lookup(extension);

    if (!contentType || !file?.buffer) {
      throw new Error(`Invalid file: ${file?.originalname || 'unknown'}`);
    }

    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: contentType
    };

    return s3.upload(params).promise().then(() =>
      `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`
    );
  });

  const results = await Promise.all(uploadTasks);
  return Array.isArray(files) ? results : results[0];
};

module.exports = uploadToS3;
