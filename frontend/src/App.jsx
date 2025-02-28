import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import Layout from './pages/Layout';
import Home from './pages/Home';
import DiaryPost from './pages/DiaryPost';
import Signup from './pages/Signup';
import Login from './pages/Login';
import CalendarPage from './pages/Calendar'; // Import the CalendarPage
import Profile from './pages/Profile';

const App = () => {
  const { user } = useAuthContext();

  const elements = useRoutes([
    {
      path: '/',
      element: <Layout />, // Wrap with Layout to preserve structure
      children: [
        { path: '/', element: user ? <Home /> : <Navigate to="/api/login" /> },
        {
          path: '/api/posts/:id',
          element: user ? <DiaryPost /> : <Navigate to="/api/login" />,
        },
        {
          path: '/api/signup',
          element: !user ? <Signup /> : <Navigate to="/" />,
        },
        {
          path: '/api/login',
          element: !user ? <Login /> : <Navigate to="/" />,
        },
        {
          path: '/calendar',
          element: user ? <CalendarPage /> : <Navigate to="/api/login" />,
        },
        {
          path: '/profile',
          element: user ? <Profile /> : <Navigate to="/api/login" />,
        },
      ],
    },
  ]);

  return elements;
};

export default App;
