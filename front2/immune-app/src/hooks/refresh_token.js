import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async () => {
        try {
            const response = await axios.post('/auth/refresh', {}, {
                headers: { 'Authorization': `Bearer ${auth.refreshToken}` }
            });
            setAuth(prev => ({
                ...prev,
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token,
                role: response.data.role
            }));
            return response.data.access_token;
        } catch (err) {
            console.error('Refresh token failed:', err);
            setAuth({ email: '', accessToken: '', refreshToken: '', role: '' });
            throw err;
        }
    };

    return refresh;
};

export default useRefreshToken;