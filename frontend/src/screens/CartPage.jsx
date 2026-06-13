import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ChevronLeft } from 'lucide-react';
import { updateQuantity, removeFromCart} from '../store/slices/cartSlice';

export default function CartPage() {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const discount = useSelector((state) => state.cart.appliedDiscount);
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal - (subtotal * discount / 100);

    return (
        <div className="cart-container">
            <h2 className="section-title">
                <ShoppingBag size={28} /> Корзина
            </h2>

            {cartItems.length === 0 ? (
                <div className="cart-empty">
                    <p>Ваша корзина пуста.</p>
                    <Link to="/catalog" className="btn-primary">Перейти в каталог</Link>
                </div>
            ) : (
                <div className="cart-items-list">
                    {cartItems.map((item) => (
                        <div key={item._id || item.id} className="cart-item">
                            <div className="item-info">
                                <img src={`http://localhost:5000${item.image}`} alt={item.name} className="item-image" />
                                <div>
                                    <h3 className="item-name">{item.name}</h3>
                                    <p className="item-price">{item.price} ₽</p>
                                </div>
                            </div>

                            <div className="quantity-controls">
                                <button className="qty-btn" onClick={() => dispatch(updateQuantity({ id: item._id || item.id, delta: -1 }))}>
                                    <Minus size={16} />
                                </button>
                                <span style={{ fontWeight: 'bold', margin: '0 10px' }}>{item.quantity}</span>
                                <button className="qty-btn" onClick={() => dispatch(updateQuantity({ id: item._id || item.id, delta: 1 }))}>
                                    <Plus size={16} />
                                </button>
                                <button className="remove-btn" onClick={() => dispatch(removeFromCart(item._id || item.id))}>
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {cartItems.length > 0 && (
                <div className="cart-footer">
                    <div className="total-row">
                        <span className="total-text">Итого:</span>
                        <span className="total-amount">{total.toFixed(0)} ₽</span>
                    </div>
                    {discount > 0 && <p className="discount-text">Применена скидка {discount}%</p>}

                    <div className="actions-row">
                        <Link to="/catalog" className="btn-secondary">
                            <ChevronLeft size={20} /> Продолжить покупки
                        </Link>
                        <Link to="/order" className="btn-primary">
                            Оформить заказ
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}