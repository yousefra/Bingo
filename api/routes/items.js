const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAdminAuth = require('../middleware/check-admin-auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './itemsImages/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
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