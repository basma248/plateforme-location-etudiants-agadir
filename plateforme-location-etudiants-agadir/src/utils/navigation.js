import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  const goToRegister = () => {
    navigate('/register');
  };

  const goToForgotPassword = () => {
    navigate('/forgot-password');
  };

  const goToHome = () => {
    navigate('/');
  };

  return {
    goToLogin,
    goToRegister,
    goToForgotPassword,
    goToHome,
  };
};