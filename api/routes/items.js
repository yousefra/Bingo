const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const s3 = new aws.S3();

const checkAdminAuth = require('../middleware/check-admin-auth');

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.S3_BUCKET_LOCATION,
});

const storage = multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
        const fileName = Date.parse(new Date())/1000 + '-' + crypto.createHash('md5').update(file.fieldname).digest('hex') + '.' + file.originalname.split('.')[1]
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid image type'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const itemsController = require('../controllers/items');

router.get('/', itemsController.getAll);

router.get('/:categoryId', itemsController.getItemsByCategory);

router.post('/', checkAdminAuth, upload.single('image'), itemsController.createItem);

router.patch('/:itemId', checkAdminAuth, upload.single('image'), itemsController.updateItem);

router.delete('/:itemId', checkAdminAuth, itemsController.deleteItem);

module.exports = router;