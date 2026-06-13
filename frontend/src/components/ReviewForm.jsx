import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProductReview, fetchMyReviews } from '../store/slices/reviewSlice';

export default function ReviewForm({ productId, productName, onClose }) {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createProductReview({ productId, review: { rating, comment } })).unwrap();
            dispatch(fetchMyReviews());
            onClose();
        } catch (error) {
            console.error("Ошибка при отправке:", error);
            alert("Не удалось отправить отзыв");
        }
    };

    return (
        <div className="review-modal-overlay">
            <div className="review-modal-content">
                <h3>Отзыв на: {productName}</h3>
                <form onSubmit={submitHandler}>
                    <div className="review-form-group">
                        <label>Оценка (1-5):</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                        />
                    </div>
                    <div className="review-form-group">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Ваш комментарий..."
                            required
                        />
                    </div>
                    <div className="review-modal-actions">
                        <button type="submit" className="btn-primary">Отправить</button>
                        <button type="button" className="btn-secondary" onClick={onClose}>Закрыть</button>
                    </div>
                </form>
            </div>
        </div>
    );
}