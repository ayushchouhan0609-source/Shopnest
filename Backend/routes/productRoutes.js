const express = require('express');

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

//all produts
router.route('/').get(getProducts).post(protect, admin, upload.single('image'), createProduct);
//specific product

router.route('/:id').get(getProduct).put(protect, admin, upload.single('image'), updateProduct).delete(protect, admin, deleteProduct);
module.exports = router;