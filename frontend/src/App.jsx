import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CatalogPage from './screens/CatalogPage';
import HomePage from './screens/HomePage';
import BlogPage from './screens/BlogPage';
import CartPage from './screens/CartPage';
import ProductPage from './screens/ProductPage';
import OrderPage from './screens/OrderPage';
import ProfilePage from './screens/ProfilePage';
import AdminPage from './screens/AdminPAge';
import AuthPage from './screens/AuthPage';
import PostPage from './screens/PostPage';
import OrderSuccessPage from './screens/OrderSuccess';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<PostPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/order_success" element={<OrderSuccessPage />} />
      </Routes>
      <Footer />
    </main>
  );
}

export default App;
