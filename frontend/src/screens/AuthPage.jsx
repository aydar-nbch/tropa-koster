import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, clearUserError } from '../store/slices/userSlice'; 

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, userInfo } = useSelector((state) => state.user);

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [userInfo, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            const result = await dispatch(loginUser({
                email: formData.email,
                password: formData.password
            }));

            if (result.payload === undefined) { // result.payload будет определен только при ошибке (rejectWithValue)
                navigate('/');
            }
        } else {
            const result = await dispatch(registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password
            }));

            if (result.payload === undefined) {
                navigate('/');
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h2 className="auth-title">
                        {isLogin ? 'С возвращением!' : 'Создайте аккаунт'}
                    </h2>
                    <p className="auth-subtitle">
                        {isLogin
                            ? 'Войдите, чтобы продолжить покупки'
                            : 'Присоединяйтесь к нашему сообществу'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label>Ваше имя</label>
                            <input
                                type="text"
                                name="name"
                                className="auth-input"
                                placeholder="Иван Иванов"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            className="auth-input"
                            placeholder="example@mail.ru"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Пароль</label>
                        <input
                            type="password"
                            name="password"
                            className="auth-input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                            <button onClick={() => dispatch(clearUserError())} className="error-close">×</button>
                        </div>
                    )}

                    <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                        {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>
                        {isLogin ? 'Еще не с нами?' : 'Уже есть аккаунт?'}
                    </span>
                    <button
                        className="auth-switch-btn"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            dispatch(clearUserError());
                        }}
                    >
                        {isLogin ? 'Создать профиль' : 'Войти'}
                    </button>
                </div>
            </div>
        </div>
    );
}
