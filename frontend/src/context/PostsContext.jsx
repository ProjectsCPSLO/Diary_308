import { createContext, useReducer, useEffect } from 'react';

export const PostsContext = createContext();

export const postsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_POSTS':
      return {
        ...state,
        posts: action.payload,
      };
    case 'CREATE_POST':
      return {
        posts: [action.payload, ...state.posts],
      };
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload),
      };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      };
    case 'SEARCH_POSTS':
      return {
        ...state,
        searchResults: action.payload,
      };
    case 'CLEAR_SEARCH':
      return {
        ...state,
        searchResults: null,
      };
    default:
      return state;
  }
};

export const PostsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postsReducer, {
    posts: null,
    searchResults: null,
  });

  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        const response = await fetch(
          'https://diary-backend-d7dxfjbpe8g0cchj.westus3-01.azurewebsites.net/api/posts',
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
          },
          }
        
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: 'SET_POSTS', payload: data });
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    
    fetchPosts();
  }, []);

  return (
    <PostsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </PostsContext.Provider>
  );
};