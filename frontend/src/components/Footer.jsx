import { SlSocialVkontakte } from "react-icons/sl";
import { FaTelegramPlane } from "react-icons/fa";
import { MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="main-footer">
            <div className="container footer-grid">
                <div>
                    <h4 className="footer-title">О компании</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>Мы помогаем туристам и любителям отдыха на природе подготовиться к любым приключениям с 2015 года.</p>
                </div>
                <div>
                    <h4 className="footer-title">Покупателям</h4>
                    <ul className="footer-list">
                        <li><Link to="/">Главная</Link> </li>
                        <li><Link to="/catalog">Каталог</Link></li>
                        <li><Link to="/blog">Блог</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="footer-title">Контакты</h4>
                    <ul className="footer-list">
                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} /> г. Казань, ул. Туристов 1</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={16} /> +7 (800) 555-55-55</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={16} /> info@tropa-koster.ru</li>
                    </ul>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                        <SlSocialVkontakte size={20} className="cursor-pointer" />
                        <FaTelegramPlane size={20} className="cursor-pointer" />
                    </div>
                </div>
            </div>
        </footer>
    );
}