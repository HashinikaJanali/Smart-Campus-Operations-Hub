import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const useRequireAuth = () => {
    const navigate = useNavigate();

    const requireAuth = (action) => {
        if (!authService.isLoggedIn()) {
            localStorage.setItem('redirectAfterLogin',
                window.location.pathname);
            navigate('/login');
            return false;
        }
        if (action) action();
        return true;
    };

    return requireAuth;
};

export default useRequireAuth;