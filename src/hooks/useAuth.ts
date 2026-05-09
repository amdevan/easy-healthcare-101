import { useContext, type ContextType } from 'react';
import { AuthContext } from '@/context/AuthContext';

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      login: async (_credentials?: any) => {},
      register: async (_data: any) => {},
      logout: async () => {},
      isLoading: false,
    };
  }
  return ctx;
};

export default useAuth;
