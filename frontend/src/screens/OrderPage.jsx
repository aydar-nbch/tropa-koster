import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Truck, CreditCard, User, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { createOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';

export default function OrderPage() {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        delivery: 'courier',
        payment: 'card'
    });

    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const validate = () => {
        let tempErrors = {};
        if (!formData.name.trim()) tempErrors.name = 'Имя обязательно';
        if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Неверный формат Email';
        if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) tempErrors.phone = 'Неверный формат телефона';
        if (!formData.address.trim()) tempErrors.address = 'Адрес обязателен';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setApiError('');

        const orderData = {
            orderItems: cart.items.map(item => ({
                name: item.name,
                qty: item.quantity,
                image: item.image,
                price: item.price,
                product: item._id
            })),
            shippingAddress: {
                address: formData.address,
                city: 'Город',
                postalCode: '000000',
                phone: formData.phone
            },
            paymentMethod: formData.payment,
            itemsPrice: cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
            shippingPrice: 0,
            totalPrice: cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
        };

        try {
            const createdOrder = await dispatch(createOrder(orderData)).unwrap();

            dispatch(clearCart());

            if (formData.payment === 'card') {
                const { data } = await axios.post('http://localhost:5000/api/orders/yookassa', {
                    orderId: createdOrder._id,
                    amount: createdOrder.totalPrice
                }, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });

                if (data.confirmation_url) {
                    window.location.href = data.confirmation_url;
                }
            } else {
                setIsSubmitted(true);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            setApiError('Не удалось оформить заказ. Попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="confirmation-page">
                <CheckCircle size={64} className="confirmation-icon" />
                <h2 className="confirmation-title">Заказ подтвержден!</h2>
                <p className="confirmation-message">Спасибо за покупку. Мы свяжемся с вами в ближайшее время.</p>
                <button onClick={() => setIsSubmitted(false)} className="btn-primary">
                    Вернуться в магазин
                </button>
            </div>
        );
    }

    return (
        <div className="order-page">
            <h1 className="order-title">Оформление заказа</h1>

            <form onSubmit={handleSubmit} className="order-form">
                <div className="form-section">
                    <h2 className="section-title"><User size={20} /> Контакты</h2>

                    <input name="name" placeholder="Имя" className="input-field" onChange={handleInputChange} />
                    {errors.name && <p className="error-message">{errors.name}</p>}

                    <input name="email" placeholder="Email" className="input-field" onChange={handleInputChange} />
                    {errors.email && <p className="error-message">{errors.email}</p>}

                    <input name="phone" placeholder="Телефон" className="input-field" onChange={handleInputChange} />
                    {errors.phone && <p className="error-message">{errors.phone}</p>}

                    <input name="address" placeholder="Адрес доставки" className="input-field" onChange={handleInputChange} />
                    {errors.address && <p className="error-message">{errors.address}</p>}
                </div>

                <div className="form-section">
                    <h2 className="section-title"><Truck size={20} /> Способ доставки</h2>
                    <div className="delivery-options">
                        <label><input type="radio" name="delivery" checked={formData.delivery === 'courier'} onChange={() => setFormData({ ...formData, delivery: 'courier' })} /> Курьером</label>
                        <label><input type="radio" name="delivery" checked={formData.delivery === 'pickup'} onChange={() => setFormData({ ...formData, delivery: 'pickup' })} /> Самовывоз</label>
                    </div>

                    <h2 className="section-title"><CreditCard size={20} /> Способ оплаты</h2>
                    <select className="payment-select" name="payment" onChange={handleInputChange}>
                        <option value="card">Банковская карта</option>
                        <option value="cash">Наличными при получении</option>
                    </select>

                    {apiError && <p className="error-message">{apiError}</p>}

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : 'Подтвердить заказ'}
                    </button>
                </div>
            </form>
        </div>
    );
}