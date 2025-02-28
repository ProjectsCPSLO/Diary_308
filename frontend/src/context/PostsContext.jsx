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
    default:
      return state;
  }
};

export const PostsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postsReducer, {
    posts: null,
  });

  // Fetch posts from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/posts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add auth token if needed
        },
      });
      const data = await response.json();
      dispatch({ type: 'SET_POSTS', payload: data });
    };
    fetchPosts();
  }, []);

  return (
    <PostsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </PostsContext.Provider>
  );
};
