const express = require('express');
const router = express.Router();
const categoryCtrl = require('../controllers/categoryController');

router.get('/', categoryCtrl.getCategories);
router.post('/', categoryCtrl.createCategory);

module.exports = router;
