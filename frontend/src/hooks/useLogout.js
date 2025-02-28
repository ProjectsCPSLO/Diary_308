import { useAuthContext } from './useAuthContext';
import { usePostsContext } from './usePostsContext';

export const useLogout = () => {
  const { dispatch: dispatchUser } = useAuthContext();
  const { dispatch: dispatchPosts } = usePostsContext();

  const logout = () => {
    localStorage.removeItem('user');
    dispatchUser({ type: 'LOGOUT' });
    dispatchPosts({ type: 'SET_POSTS', payload: null });
  };

  return { logout };
};
