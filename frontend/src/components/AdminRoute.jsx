import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const { userInfo } = useSelector((state) => state.user);

    if (userInfo && userInfo.isAdmin) {
        return children;
    }

    return <Navigate to="/" replace />;
};

export default AdminRoute;