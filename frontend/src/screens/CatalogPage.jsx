import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import { addToCart, updateQuantity } from '../store/slices/cartSlice';
import { Star } from 'lucide-react';


export default function CatalogPage() {
    const dispatch = useDispatch();
    const location = useLocation(); 

    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('Все');
    const [maxPrice, setMaxPrice] = useState(100000);
    const [sortBy, setSortBy] = useState('price-asc');

    const { products, loading } = useSelector((state) => state.products);
    const cartItems = useSelector((state) => state.cart.items);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        if (location.state?.initialCategory) {
            setCategory(location.state.initialCategory);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const categories = useMemo(() => {
        const unique = [...new Set(products.map(p => p.category))];
        return ['Все', ...unique];
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = category === 'Все' || p.category === category;
            const matchesPrice = p.price <= maxPrice;
            return matchesSearch && matchesCategory && matchesPrice;
        }).sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
            return 0;
        });
    }, [searchTerm, category, maxPrice, sortBy, products]);

    return (
        <div className="catalog-container">
            <h1 className="catalog-title">Каталог товаров</h1>

            <div className="filter-bar">
                <div className="search-wrapper">
                    <input
                        type="text"
                        placeholder="Поиск по названию..."
                        className="search-input"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className='filter-items'>
                    {/* ВАЖНО: добавили value={category} */}
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="filter-select"
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <div className="price-control">
                        <span className="price-label">Цена до: {maxPrice}₽</span>
                        <input
                            className='price-slider'
                            type="range"
                            min="500" max="100000" step="500"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                        />
                    </div>

                    <select onChange={(e) => setSortBy(e.target.value)} className="filter-select">
                        <option value="price-asc">Цена: по возрастанию</option>
                        <option value="price-desc">Цена: по убыванию</option>
                        <option value="rating">По рейтингу</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <p className="text-center">Загрузка...</p>
            ) : (
                <div className="products-grid">
                    {filteredProducts.map(p => {
                        const cartItem = cartItems.find(item => (item._id || item.id) === p._id);
                        return (
                            <div key={p._id} className="catalog-card">
                                <Link to={`/product/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="catalog-card-image">
                                        <img src={`http://localhost:5000${p.image}`} alt={p.name} style={{ width: '100%', borderRadius: '12px' }} />
                                    </div>
                                    <h3 className="catalog-card-name">{p.name}</h3>
                                    <div className="catalog-card-footer">
                                        <span className="catalog-card-price">{p.price} ₽</span>
                                    </div>
                                </Link>

                                {cartItem ? (
                                    <div className="quantity-controls" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', alignItems: 'center', gap: '10px' }}>
                                        <button className="btn-quantity" onClick={() => dispatch(updateQuantity({ id: p._id, delta: -1 }))}>-</button>
                                        <span>{cartItem.quantity}</span>
                                        <button className="btn-quantity" onClick={() => dispatch(updateQuantity({ id: p._id, delta: 1 }))}>+</button>
                                    </div>
                                ) : (
                                    <button className="add-to-cart-btn" onClick={() => dispatch(addToCart(p))} disabled={p.countInStock <= 0}>
                                        {p.countInStock > 0 ? 'В корзину' : 'Нет в наличии'}
                                    </button>
                                )}
                                <div className="catalog-raiting">
                                    <Star size={20} fill="currentColor" />
                                    <span>{p.rating || 0}</span> 
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );


}