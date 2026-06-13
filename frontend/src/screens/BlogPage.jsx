import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchPosts } from '../store/slices/blogSlice';
import { Link } from 'react-router-dom';

export default function BlogPage() {
    const dispatch = useDispatch();
    const { posts, loading } = useSelector((state) => state.blog);
    const { userInfo } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({ title: '', category: '', content: '', image: null });

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    const handleAddPost = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('content', formData.content);
        data.append('image', formData.image);

        try {
            await axios.post('http://localhost:5000/api/posts', data, {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFormData({ title: '', category: '', content: '', image: null });
            dispatch(fetchPosts());
        } catch (error) {
            console.error('Ошибка создания:', error);
            alert('Не удалось создать пост');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот пост?')) {
            try {
                await axios.delete(`http://localhost:5000/api/posts/${id}`, {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
                dispatch(fetchPosts());
            } catch (error) {
                console.error('Ошибка удаления:', error);
                alert('Ошибка при удалении');
            }
        }
    };

    return (
        <div className="blog-container">
            <h1 className="blog-title">Блог</h1>

            {/* Форма для админа */}
            {userInfo?.isAdmin && (
                <div className="admin-section">
                    <h3>Добавить новую статью</h3>
                    <form onSubmit={handleAddPost} className="admin-form">
                        <input type="text" placeholder="Заголовок" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        <input type="text" placeholder="Категория" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
                        <textarea placeholder="Текст статьи" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} required />
                        <input type="file" onChange={e => setFormData({ ...formData, image: e.target.files[0] })} required />
                        <button type="submit">Опубликовать</button>
                    </form>
                </div>
            )}

            {/* Список постов */}
            {loading ? <p>Загрузка...</p> : (
                <div className="blog-grid">
                    {posts.map(post => (
                        <div key={post._id} className="blog-card">
                            <img src={`http://localhost:5000${post.image}`} alt={post.title} style={{ width: '100%', borderRadius: '8px' }} />
                            <span className="post-category">{post.category}</span>
                            <h3>{post.title}</h3>
                            <p>{post.content.substring(0, 100)}...</p>

                            <div className="card-actions">
                                <Link to={`/blog/${post._id}`} className="read-more-btn">
                                    Читать далее →
                                </Link>

                                {userInfo?.isAdmin && (
                                    <button onClick={() => handleDelete(post._id)} className="post-delete-btn">Удалить</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );


}