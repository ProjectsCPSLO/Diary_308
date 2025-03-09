// frontend/src/pages/PostsMap.jsx
import React, { useEffect, useState, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { ThemeContext } from '../context/ThemeContext';

const PostsMap = () => {
  const { user } = useAuthContext();
  const { theme } = useContext(ThemeContext);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try { 
        const response = await fetch('http://localhost:4000/api/posts', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        // Filter posts that have a valid location
        const postsWithLocation = data.filter(post => 
          post.location &&
          typeof post.location.lat === 'number' &&
          typeof post.location.lng === 'number'
        );
        setPosts(postsWithLocation);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [user]);

  return (
    <Box
      sx={{
        // Make the entire page fill the viewport
        position: 'fixed',
        top: 60, // If your navbar is 60px tall
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 60px)', // subtract navbar height
        backgroundColor: theme === 'dark' ? '#1c1c1c' : '#ffffff',
        transition: 'background-color 0.3s ease',
      }}
    >
      <MapContainer
        center={[20, 0]} // roughly the center of the world
        zoom={2}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org/copyright">
            OpenStreetMap
          </a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {posts.map(post => (
          <Marker
            key={post._id}
            position={[post.location.lat, post.location.lng]}
            eventHandlers={{
              click: () => navigate(`/api/posts/${post._id}`),
            }}
          >
            <Popup>
              <Typography variant="subtitle1">{post.title}</Typography>
              <Typography
                variant="body2"
                onClick={() => navigate(`/api/posts/${post._id}`)}
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                View Post
              </Typography>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default PostsMap;
