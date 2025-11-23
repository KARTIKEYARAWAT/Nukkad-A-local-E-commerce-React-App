import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');
    
    if (token) {
      localStorage.setItem('token', token);
      
      if (user) {
        try {
          const userData = JSON.parse(decodeURIComponent(user));
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      // If no token, redirect to login page
      navigate('/login');
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="text-center text-white">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-lg">Completing your login...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;