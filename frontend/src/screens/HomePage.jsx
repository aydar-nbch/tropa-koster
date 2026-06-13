import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Tent, Utensils, Backpack, Zap, Coffee, Shirt, BookOpen } from 'lucide-react';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchPosts } from '../store/slices/blogSlice';

export default function HomePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { products } = useSelector((state) => state.products);
    const { posts } = useSelector((state) => state.blog);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchPosts());
    }, [dispatch]);

    const featuredProducts = [...products]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    const latestPosts = [...posts].slice(0, 3);

    const handleCategoryClick = (categoryName) => {
        navigate('/catalog', { state: { initialCategory: categoryName } });
    };

    const categories = [
        { name: 'Палатки', icon: <Tent size={20} /> },
        { name: 'Грили', icon: <Utensils size={20} /> },
        { name: 'Рюкзаки', icon: <Backpack size={20} /> },
        { name: 'Освещение', icon: <Zap size={20} /> },
        { name: 'Кухня', icon: <Coffee size={20} /> },
        { name: 'Одежда', icon: <Shirt size={20} /> }
    ];

    return (
        <main className="container flex-grow">
            <section className="hero-banner">
                <div className="hero-banner-title">
                    <h2>Твое приключение<br />начинается здесь</h2>
                    <Link to="/catalog" className="btn-primary">Перейти в каталог</Link>
                </div>
                <div className="illustration-campfire">🔥</div>
            </section>

            <section className="categories-grid">
                {categories.map((cat, idx) => (
                    <div
                        key={idx}
                        className="category-card"
                        onClick={() => handleCategoryClick(cat.name)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div style={{ color: '#064e3b' }}>{cat.icon}</div>
                        <span style={{ fontWeight: 600, color: '#064e3b', fontSize: '0.9rem' }}>{cat.name}</span>
                    </div>
                ))}
            </section>

            <h2 className="section-title">Рекомендуемые товары</h2>
            <div className="products-grid">
                {featuredProducts.map(product => (
                    <div key={product._id} className="product-card">
                        <div className='product-card-image-container'>
                            <img src={`http://localhost:5000${product.image}`} alt={product.name} />
                        </div>
                        <div className='product-card-info'>
                            <h4 className='product-card-title'>{product.name}</h4>
                            <span>{product.price} ₽</span>
                            <Link to={`/product/${product._id}`} className='home-cards-details'>Подробнее →</Link>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="section-title">Последние статьи блога</h2>
            <div className="blog-grid">
                {latestPosts.map(post => (
                    <div key={post._id} className="home-blog-card">
                        <BookOpen color="#064e3b" size={24} style={{ marginBottom: '10px' }} />
                        <h4 style={{ color: '#064e3b', margin: '0 0 8px' }}>{post.title}</h4>
                        <p style={{ fontSize: '0.9rem', color: '#4b5563', margin: '0 0 15px' }}>{post.content.substring(0, 70)}...</p>
                        <Link to={`/blog/${post._id}`} className='home-cards-details'>Читать далее →</Link>
                    </div>
                ))}
            </div>
        </main>
    );


}