const express = require('express');
const router = express.Router();
const { getMyReviews, createProductReview, getReviewsByProductId } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/product/:productId', getReviewsByProductId);

// Маршрут для получения списка своих отзывов
router.get('/myreviews', protect, getMyReviews);

// Маршрут для создания отзыва
router.post('/:productId', protect, createProductReview);



module.exports = router;