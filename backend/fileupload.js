const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const app = express();
const port = 3000;

const s3Client = new S3Client({
  region: 'us-east-1', // Replace with your preferred region
  credentials: {
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'your-s3-bucket-name',
    acl: 'public-read', // Make the uploaded file public
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
});