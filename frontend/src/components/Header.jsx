import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingBag, Flame, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/userSlice';

export default function Header() { 
    const [isOpen, setIsOpen] = useState(false); // Состояние меню
    const dispatch = useDispatch();
    const location = useLocation();
    const { userInfo } = useSelector((state) => state.user);
    const isAdmin = userInfo && userInfo.isAdmin === true;
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <header className="main-header">
            <div className="container header-wrap">
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="logo-block">
                        <div className="logo-icon"><Flame size={24} /></div>
                        <div className="logo-title">Тропа & Костер</div>
                    </div>
                </Link>

                <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <nav className={`nav-menu ${isOpen ? 'open' : ''}`}>
                    <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setIsOpen(false)}>Главная</Link>
                    <Link to="/catalog" className={`nav-link ${isActive('/catalog')}`} onClick={() => setIsOpen(false)}>Каталог</Link>
                    <Link to="/blog" className={`nav-link ${isActive('/blog')}`} onClick={() => setIsOpen(false)}>Блог</Link>
                </nav>

                <div className='nav-icons'>
                    {userInfo ? (
                        <button
                            onClick={() => dispatch(logout())}
                            className="nav-link"
                            title="Выйти из аккаунта"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            <LogOut size={20} />
                        </button>
                    ) : (
                        <Link to="/auth" className="login-btn" title="Войти в аккаунт">Войти</Link>
                    )}

                    {userInfo && (
                        <Link to="/profile" className="nav-link" title="Профиль">
                            <User size={20} />
                        </Link>
                    )}

                    {isAdmin && (
                        <Link to="/admin" className="nav-link" title="Настройки">
                            <Settings size={20} />
                        </Link>
                    )}

                    {userInfo && (
                        <Link to="/cart" className="btn-primary" style={{ padding: '8px 16px' }}>
                            <ShoppingBag size={18} />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
