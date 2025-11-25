import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  const { login, register, logout, resetPassword, user } = useContext(AuthContext);

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
    } catch (error) {
      throw new Error('Login failed: ' + error.message);
    }
  };

  const handleRegister = async (email, password) => {
    try {
      await register(email, password);
    } catch (error) {
      throw new Error('Registration failed: ' + error.message);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleResetPassword = async (email) => {
    try {
      await resetPassword(email);
    } catch (error) {
      throw new Error('Password reset failed: ' + error.message);
    }
  };

  return {
    user,
    handleLogin,
    handleRegister,
    handleLogout,
    handleResetPassword,
  };
};

export default useAuth;