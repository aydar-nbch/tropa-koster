import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostById, clearCurrentPost } from '../store/slices/blogSlice';
import { ChevronLeft } from 'lucide-react';

export default function PostPage() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { currentPost, loading, error } = useSelector((state) => state.blog);

    useEffect(() => {
        dispatch(fetchPostById(id));

        return () => {
            dispatch(clearCurrentPost());
        };
    }, [dispatch, id]);

    if (loading) return <div className="blog-container"><p>Загрузка статьи...</p></div>;
    if (error) return <div className="blog-container"><p>Ошибка: {error}</p></div>;
    if (!currentPost) return <div className="blog-container"><p>Статья не найдена.</p></div>;

    return (
        <div className="blog-container">
            <Link to="/blog" className="back-link">
                <ChevronLeft size={20} /> Назад к списку постов
            </Link>

            <article className="post-full">
                <img
                    src={`http://localhost:5000${currentPost.image}`}
                    alt={currentPost.title}
                    className="post-full-image"
                />

                <div className="post-meta">
                    <span>{currentPost.category}</span> | <span>{new Date(currentPost.createdAt).toLocaleDateString()}</span>
                </div>

                <h1 className="post-title">{currentPost.title}</h1>

                <div className="post-content">
                    {currentPost.content.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </article>
        </div>
    );


}