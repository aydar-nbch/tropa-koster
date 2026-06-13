import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Star, Save, Package, MessageSquare } from 'lucide-react';
import { fetchMyOrders } from '../store/slices/orderSlice';
import { fetchMyReviews } from '../store/slices/reviewSlice';
import { updateUserProfile } from '../store/slices/userSlice';
import ReviewForm from '../components/ReviewForm';

export default function ProfilePage() {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('profile');
    const [reviewForm, setReviewForm] = useState(null);

    const { userInfo } = useSelector((state) => state.user);
    const { orders, loading: ordersLoading, error: ordersError } = useSelector((state) => state.orders);
    const { myReviews, loading: reviewsLoading, error: reviewsError } = useSelector((state) => state.reviews);
    const allPurchasedItems = orders.flatMap(order => order.orderItems);

    const uniquePurchasedItems = Array.from(
        new Map(allPurchasedItems.map(item => [item.product, item])).values()
    );

    const reviewedProductIds = new Set(myReviews.map(r => r.product?._id));


    const [userData, setUserData] = useState({
        name: userInfo?.name || '',
        email: userInfo?.email || ''
    });

    useEffect(() => {
        if (activeTab === 'orders') {
            dispatch(fetchMyOrders());
        } else if (activeTab === 'reviews') {
            dispatch(fetchMyReviews());
            dispatch(fetchMyOrders());
        }
    }, [activeTab, dispatch]);

    const handleSave = async () => {
        try {
            await dispatch(updateUserProfile(userData)).unwrap();
            alert('Данные успешно обновлены!');
        } catch (err) {
            alert('Ошибка: ' + err);
        }
    };

    return (
        <div className="profile-page">
            <h1 className="profile-title">
                <User size={30} /> Личный кабинет
            </h1>

            <div className="tabs-container">
                {['profile', 'orders', 'reviews'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                    >
                        {tab === 'profile' ? 'Профиль' : tab === 'orders' ? 'История заказов' : 'Отзывы'}
                    </button>
                ))}
            </div>

            {/* ВКЛАДКА: ПРОФИЛЬ */}
            {activeTab === 'profile' && (
                <div className="profile-form">
                    {Object.entries(userData).map(([key, value]) => (
                        <div key={key} className="form-group">
                            <label className="form-label">
                                {key === 'name' ? 'Имя' : 'Email'}
                            </label>
                            <input
                                className="form-input"
                                value={value}
                                onChange={(e) => setUserData({ ...userData, [key]: e.target.value })}
                            />
                        </div>
                    ))}
                    <button className="btn-primary" onClick={handleSave}>
                        <Save size={16} /> Сохранить изменения
                    </button>
                </div>
            )}

            {/* ВКЛАДКА: ЗАКАЗЫ */}
            {activeTab === 'orders' && (
                <div className="orders-list">
                    {ordersLoading && <p className="text-center">Загрузка заказов...</p>}
                    {ordersError && <p className="text-danger">Ошибка: {ordersError}</p>}

                    {!ordersLoading && orders.length === 0 && (
                        <div className="reviews-empty">
                            <Package size={48} className="reviews-icon" />
                            <p className="reviews-message">У вас пока нет заказов.</p>
                        </div>
                    )}

                    {orders.map(order => (
                        <div key={order._id} className="order-card">
                            <div className="order-info">
                                <p className="order-id">Заказ {order._id.slice(-6).toUpperCase()}</p>
                                <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <p className="order-total">{order.totalPrice} ₽</p>
                            <span className="order-status">{order.isDelivered ? 'Доставлен' : 'В обработке'}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* ВКЛАДКА: ОТЗЫВЫ */}
            {activeTab === 'reviews' && (
                <div className="reviews-list">
                    <h3 className="section-title">Оставить отзыв о покупках</h3>
                    <div className="purchased-products-grid">
                        {uniquePurchasedItems.map(item => {
                            const isAlreadyReviewed = reviewedProductIds.has(item.product);

                            return (
                                <div key={item.product} className="mini-product-card">
                                    <img src={`http://localhost:5000${item.image}`} alt={item.name} style={{ width: "100px", height: "auto" }} />
                                    <p>{item.name}</p>

                                    {isAlreadyReviewed ? (
                                        <button className="btn-disabled" disabled>Отзыв оставлен</button>
                                    ) : (
                                        <button
                                            className="btn-primary"
                                            onClick={() => setReviewForm({ productId: item.product, productName: item.name })}
                                        >
                                            Оставить отзыв
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <h3 className="section-title">Мои отзывы</h3>
                    {reviewsLoading && <p className="text-center">Загрузка отзывов...</p>}
                    {reviewsError && <p className="text-danger">Ошибка: {reviewsError}</p>}

                    {!reviewsLoading && myReviews.length === 0 && (
                        <div className="reviews-empty">
                            <MessageSquare size={48} className="reviews-icon" />
                            <p className="reviews-message">Вы еще не оставили ни одного отзыва.</p>
                        </div>
                    )}

                    {myReviews.map(review => (
                        <div key={review._id} className="review-card">
                            <div className="review-header">
                                <span className="review-user">{review.product?.name || 'Товар'}</span>
                                <div className="review-rating">
                                    <Star size={14} fill="#f59e0b" color="#f59e0b" /> {review.rating}
                                </div>
                            </div>
                            <p className="review-text">{review.comment}</p>
                            <div className="review-footer">
                                <span className="post-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {reviewForm && (
                <ReviewForm
                    productId={reviewForm.productId}
                    productName={reviewForm.productName}
                    onClose={() => setReviewForm(null)}
                />
            )}
        </div>
    );
}
