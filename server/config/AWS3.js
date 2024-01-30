require("dotenv").config();
const AWS = require("aws-sdk");

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const Bucket = process.env.S3_BUCKET;

const client = new S3({
    credentials: {
        accessKeyId,
        secretAccessKey
    },
    region
});


module.exports = client;