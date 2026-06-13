import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    LayoutDashboard, Package, ShoppingCart, BarChart3,
    Trash2, Edit2, ChevronDown, ChevronUp,
    DollarSign, TrendingUp, Users, X
} from 'lucide-react';

import { fetchProducts, createProductAdmin, updateProductAdmin, deleteProductAdmin } from '../store/slices/productSlice';
import { fetchAllOrdersAdmin, deliverOrderAdmin, fetchSalesStatsAdmin } from '../store/slices/orderSlice';

export default function AdminPage() {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('products');
    const [orderFilter, setOrderFilter] = useState('Все');
    const [dateFilter, setDateFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Все');
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const allCategories = [
        'Палатки',
        'Грили',
        'Рюкзаки',
        'Освещение',
        'Кухни',
        'Одежда'
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '',
        price: '',
        category: allCategories[0], 
        description: '',
        image: '',
        countInStock: 0
    });

    const { products, loading: prodLoading } = useSelector((state) => state.products);
    const { adminOrders, adminStats, loading: ordLoading } = useSelector((state) => state.orders);

    useEffect(() => {
        if (activeTab === 'products') {
            dispatch(fetchProducts({ category: categoryFilter }));
        } else if (activeTab === 'orders') {
            dispatch(fetchAllOrdersAdmin());
        } else if (activeTab === 'stats') {
            dispatch(fetchSalesStatsAdmin());
        }
    }, [activeTab, dispatch, categoryFilter]);

    

    const filteredProducts = useMemo(() => {
        return categoryFilter === 'Все' ? products : products.filter(p => p.category === categoryFilter);
    }, [categoryFilter, products]);

    const filteredOrders = useMemo(() => {
        let result = adminOrders || [];
        if (orderFilter === 'Доставлен') result = result.filter(o => o.isDelivered === true);
        if (orderFilter === 'Новый') result = result.filter(o => o.isDelivered === false);
        if (dateFilter) {
            result = result.filter(o => o.createdAt && new Date(o.createdAt).toISOString().split('T')[0] === dateFilter);
        }
        return result;
    }, [orderFilter, dateFilter, adminOrders]);

    const openAddModal = () => {
        setEditingProduct(null);
        setProductForm({ name: '', price: '', category: 'Палатки', description: '', image: '', countInStock: 0 });
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setProductForm({ ...product });
        setIsModalOpen(true);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        if (editingProduct) {
            await dispatch(updateProductAdmin({ id: editingProduct._id, productData: productForm }));
        } else {
            await dispatch(createProductAdmin(productForm));
        }
        setIsModalOpen(false);
    };

    const renderValue = (val) => {
        if (val === null || val === undefined) return 'Не указано';
        if (typeof val === 'object') {
            if (Array.isArray(val)) return val.join(', ');
            return Object.values(val).filter(v => v !== null).join(', ');
        }
        return String(val);
    };

    
    return (
        <div className="admin-dashboard">
            <h1 className="dashboard-title">
                <LayoutDashboard size={30} /> Административная панель
            </h1>

            <div className="tabs-container">
                {[
                    { id: 'products', name: 'Товары', icon: Package },
                    { id: 'orders', name: 'Заказы', icon: ShoppingCart },
                    { id: 'stats', name: 'Статистика', icon: BarChart3 }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        <tab.icon size={18} /> {tab.name}
                    </button>
                ))}
            </div>

            {activeTab === 'products' && (
                <div className="products-list">
                    <div className="products-header-actions">
                        <button className="btn-primary" onClick={openAddModal}>Добавить товар</button>
                        <select
                            className="category-filter"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="Все">Все категории</option>
                            {allCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    {prodLoading ? <p className="text-center">Загрузка товаров...</p> :
                        filteredProducts.map(product => (
                            <div key={product._id} className="product-card">
                                <div className="admin-product-info">
                                    <p className="product-name">{product.name}</p>
                                    <p className="product-category-tag">{product.category}</p>
                                    <p className="product-price">{product.price} ₽</p>
                                    <p className="count-in-stock">{product.countInStock} шт.</p>
                                    <button className="edit-button" onClick={() => openEditModal(product)}><Edit2 size={18} /></button>
                                    <button className="delete-button" onClick={() => { if (window.confirm('Удалить товар?')) dispatch(deleteProductAdmin(product._id)) }}><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="orders-list">
                    <div className="filters-container">
                        <input type="date" className="date-filter" onChange={(e) => setDateFilter(e.target.value)} />
                        <select className="status-filter" onChange={(e) => setOrderFilter(e.target.value)}>
                            <option value="Все">Все статусы</option>
                            <option value="Новый">Новый</option>
                            <option value="Доставлен">Доставлен</option>
                        </select>
                    </div>

                    {ordLoading ? <p className="text-center">Загрузка заказов...</p> :
                        filteredOrders.map(order => (
                            <div key={order._id} className="admin-order-card">
                                <div className="order-header" onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}>
                                    <div className="admin-order-info">
                                        <p className="order-id">
                                            {order._id?.slice(-6).toUpperCase()} <span className="order-date">({order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '---'})</span>
                                        </p>
                                        <p className="order-user">{order.user?.name || 'Клиент'}</p>
                                        <p className="order-total">{order.totalPrice} ₽</p>

                                        {order.isPaid ? <span className='is-paid'>Оплачен</span> : <span className='is-not-paid'>Не оплачен</span>}
                                        
                                        <span className={`order-status ${order.isDelivered ? 'delivered' : ''}`}>
                                            {order.isDelivered ? 'Доставлен' : 'Новый'}
                                        </span>
                                        {expandedOrderId === order._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>

                                {expandedOrderId === order._id && (
                                    <div className="order-details">
                                        <div className='order-details-container'>
                                            <div>
                                                <h4 style={{ marginBottom: '10px', fontWeight: 'bold', color: 'var(--forest)' }}>📦 Состав заказа:</h4>
                                                <div className="order-items-list">
                                                    {order.orderItems && Array.isArray(order.orderItems) ? (
                                                        order.orderItems.map((item, idx) => (
                                                            <div key={idx} className="order-item">
                                                                <div className="order-item-string">
                                                                    <span>{item.name || 'Товар'} x {item.qty}</span>
                                                                    <span>{item.price * item.qty} ₽</span>
                                                                </div>
                                                                <div className="order-item-string">
                                                                    <span>Доставка:</span>
                                                                    <span>{order.shippingPrice} ₽</span>
                                                                </div>
                                                                <div className="order-item-string">
                                                                    <span>ИТОГО:</span>
                                                                    <span>{order.totalPrice} ₽</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : <p>Нет данных</p>}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 style={{ marginBottom: '10px', fontWeight: 'bold', color: 'var(--forest)' }}>👤 Информация:</h4>
                                                <div className="order-customer-info">
                                                    <p><span className="info-label">Получатель:</span> {order.user?.name || 'Не указан'}</p>
                                                    <p><span className="info-label">Email:</span> {order.user?.email || 'Не указан'}</p>
                                                    <p><span className="info-label">Телефон:</span> {order.shippingAddress?.phone || 'Не указан'}</p>
                                                    <p><span className="info-label">Адрес:</span> {
                                                        typeof order.shippingAddress === 'object' && order.shippingAddress !== null
                                                            ? `${order.shippingAddress.city || ''}, ${order.shippingAddress.address || ''}, ${order.shippingAddress.postalCode || ''}`.replace(/, ,/g, ',').replace(/^, /, '')
                                                            : renderValue(order.shippingAddress)
                                                    }</p>
                                                    <div style={{ marginTop: '10px', padding: '8px', background: '#f1f5f9', borderRadius: '6px', fontSize: '0.85rem' }}>
                                                        <p style={{ margin: 0 }}><strong>Оплата:</strong> {order.paymentMethod || 'Не указано'}</p>
                                                        <p style={{ margin: 0 }}><strong>Статус:</strong> {order.isPaid ? '✅ Оплачено' : '❌ Не оплачено'}</p>
                                                    </div>
                                                    {!order.isDelivered && (
                                                        <button className="btn-primary" style={{ marginTop: '15px', width: '100%' }} onClick={() => dispatch(deliverOrderAdmin(order._id))}>
                                                            Отметить как доставленный
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    }
                </div>
            )}

            {activeTab === 'stats' && (
                <div className="stats-grid">
                    <div className="stat-card revenue-card">
                        <DollarSign className="stat-icon" size={24} />
                        <h3 className="stat-title">Общая выручка</h3>
                        <p className="stat-value">{adminStats?.totalSales || 0} ₽</p>
                    </div>
                    <div className="stat-card orders-card">
                        <TrendingUp className="stat-icon" size={24} />
                        <h3 className="stat-title">Всего заказов</h3>
                        <p className="stat-value">{adminStats?.totalOrders || 0}</p>
                    </div>
                    <div className="stat-card products-card">
                        <Users className="stat-icon" size={24} />
                        <h3 className="stat-title">Товаров в базе</h3>
                        <p className="stat-value">{products.length}</p>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 style={{ margin: 0 }}>{editingProduct ? 'Редактировать товар' : 'Добавить товар'}</h2>
                            <button className="close-modal" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveProduct} className="modal-form">
                            <div className="form-group"><label>Название</label><input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required /></div>
                            <div className="form-group"><label>Цена (₽)</label><input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required /></div>
                            <div className="form-group">
                                <label>Категория</label>
                                <select
                                    value={productForm.category}
                                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                                >
                                    {allCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group"><label>Описание</label><textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} required /></div>
                            <div className="form-group">
                                <label>Фото товара</label>
                                {editingProduct && typeof productForm.image === 'string' && (
                                    <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '5px' }}>
                                        Текущее фото: {productForm.image}
                                    </p>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setProductForm({ ...productForm, image: e.target.files[0] })}
                                    required={!editingProduct}
                                />
                            </div>
                            <div className="form-group"><label>Склад</label><input type="number" value={productForm.countInStock} onChange={e => setProductForm({ ...productForm, countInStock: e.target.value })} required /></div>
                            <button type="submit" className="btn-primary">Сохранить товар</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
