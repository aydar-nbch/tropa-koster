import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';


export default function OrderSuccessPage() {
    return (
        <div className="confirmation-page">
            <CheckCircle size={64} className="confirmation-icon" />
            <h2 className="confirmation-title">Заказ подтвержден!</h2>
            <p className="confirmation-message">Спасибо за покупку. Мы свяжемся с вами в ближайшее время.</p>
            <Link to="/catalog">
                Вернуться в магазин
            </Link>
        </div>
    );
}
