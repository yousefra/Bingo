const express = require('express');
const router = express.Router();
const checkAdminAuth = require('../middleware/check-admin-auth');

const categoriesController = require('../controllers/categories');

router.get('/', categoriesController.getAll);

router.post('/', checkAdminAuth, categoriesController.createCategory);

router.patch('/:categoryId', checkAdminAuth, categoriesController.updateCategory);

router.delete('/:categoryId', checkAdminAuth, categoriesController.deleteCategory);

module.exports = router;