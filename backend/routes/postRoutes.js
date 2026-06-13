const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getPosts, getPostById, createPost, deletePost } = require('../controllers/postController');
const { protect, admin } = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

// Публичные маршруты
router.route('/').get(getPosts);
router.route('/:id').get(getPostById);

// Маршруты для админа
router.route('/')
    .post(protect, admin, upload.single('image'), createPost);
router.route('/:id')
    .delete(protect, admin, deletePost);

module.exports = router;