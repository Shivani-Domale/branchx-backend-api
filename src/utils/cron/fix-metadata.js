const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET = process.env.AWS_S3_BUCKET_NAME;
const PREFIX = "adds/";

const fixMetadata = async (campaignId) => {
  try {
    const listed = await s3.listObjectsV2({
      Bucket: BUCKET,
      Prefix: `${PREFIX}${campaignId}/`
    }).promise();

    if (!listed.Contents.length) return;

    const videoFiles = listed.Contents.filter(obj =>
      obj.Key.match(/\.(mp4|webm|mov|mkv)$/i)
    );

    for (const file of videoFiles) {
      console.log(`Fixing metadata: ${file.Key}`);

      await s3.copyObject({
        Bucket: BUCKET,
        CopySource: `${BUCKET}/${file.Key}`,
        Key: file.Key,
        ContentType: "video/mp4",
        ContentDisposition: "inline",
        MetadataDirective: "REPLACE"
      }).promise();
    }

    console.log("Metadata fixed for uploaded videos.");
  } catch (error) {
    console.error("Error in fixMetadata:", error.message);
  }
};

module.exports = fixMetadata;
