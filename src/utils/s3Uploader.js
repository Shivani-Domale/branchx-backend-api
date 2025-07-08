const AWS = require("aws-sdk");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const mime = require("mime-types");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const UploadFile = async (buffer, originalName, adId) => {
  const extension = path.extname(originalName || ".bin");
  const fileName = `${uuidv4()}${extension}`;
  const contentType = mime.lookup(extension) || "application/octet-stream";

  const key = `adds/${adId}/${fileName}`;

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ContentDisposition: 'inline'
  };

  await s3.upload(params).promise();
  return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
};

module.exports = UploadFile;
