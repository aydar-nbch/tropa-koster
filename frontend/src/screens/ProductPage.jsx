import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Star, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchProductById } from '../store/slices/productSlice';
import { addToCart, updateQuantity } from '../store/slices/cartSlice';
import { fetchProductReviews } from '../store/slices/reviewSlice'

export default function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('description');
  const cartItems = useSelector((state) => state.cart.items);
  const { productReviews, loading: reviewsLoading } = useSelector((state) => state.reviews);
  

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchProductReviews(id));
  }, [id, dispatch]);

  const state = useSelector((state) => state.products);

  const { product, loading } = state;

  if (loading) return <div className="text-center" style={{ padding: '50px' }}>Загрузка товара...</div>;

  if (!product) return <div className="text-center" style={{ padding: '50px' }}>Товар не найден в Redux</div>;

  const cartItem = cartItems.find(item => (item._id || item.id) === product._id);

  return (
    <div className="product-detail-page">
      <Link to="/catalog" className="back-button">
        <ChevronLeft size={20} />
        Назад к каталогу
      </Link>

      <div className="product-grid">
        <div className="image-container">
          <img
            src={`http://localhost:5000${product.image}`}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
          />
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <div className="rating">
            <Star size={20} fill="currentColor" />
            <span>{product.rating || 0}</span> 
          </div>

          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Описание
            </button>
            <button
              className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Характеристики
            </button>
          </div>

          <div className="content-container">
            {activeTab === 'description' ? (
              <p className="description fade-in">{product.description}</p>
            ) : (
              <div className="specs-list fade-in">
                <p className="spec-item"><strong>Категория:</strong> {product.category}</p>
                <p className="spec-item"><strong>Склад:</strong> {product.countInStock} шт.</p>
              </div>
            )}
          </div>

          <div className="price-and-button">
            <div className="price">{product.price} ₽</div>
            {cartItem ? (
              <div className="quantity-controls">
                <button className="btn-quantity" onClick={() => dispatch(updateQuantity({ id: product._id, delta: -1 }))}>-</button>
                <span className="quantity-display">{cartItem.quantity}</span>
                <button className="btn-quantity" onClick={() => dispatch(updateQuantity({ id: product._id, delta: 1 }))}>+</button>
              </div>
            ) : (
              <button className="btn-primary" onClick={() => dispatch(addToCart(product))} disabled={product?.countInStock <= 0}>{product?.countInStock > 0 ? 'Добавить в корзину' : 'Нет в наличии'}</button>
            )}
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2 className="reviews-title">Отзывы покупателей</h2>
        {reviewsLoading ? (
          <p>Загрузка отзывов...</p>
        ) : (
          productReviews.map(review => (
            <div key={review._id} className="review-card">
              <span className="review-user">{review.user?.name || 'Пользователь'}</span>
              <div className="review-card-items">
                <p>{review.comment}</p>
                <div className='review-card-rating'>
                  <Star size={20} fill="currentColor" />
                  <span>{review.rating || 0}</span> 
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
