import React, { useEffect, useState, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { ThemeContext } from '../context/ThemeContext';

const PostsMap = () => {
  const { user } = useAuthContext();
  const { theme } = useContext(ThemeContext);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  // Select appropriate map tile layer based on theme
  const tileLayerUrl = theme === 'dark' 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' 
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  
  const tileLayerAttribution = theme === 'dark'
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  useEffect(() => {
    const fetchPosts = async () => {
      try { 
        const response = await fetch('https://diary-backend-d7dxfjbpe8g0cchj.westus3-01.azurewebsites.net/api/posts', {
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
        // Ensure full viewport coverage with no gaps
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: theme === 'dark' ? '#1c1c1c' : '#ffffff',
        transition: 'background-color 0.3s ease',
        '& .leaflet-container': {
          width: '100%',
          height: '100%',
        },
        '& .leaflet-control-container': {
          position: 'absolute',
          zIndex: 1000,
        },
        '& .leaflet-top': {
          top: '64px', // Adjust to match navbar height if needed
        },
      }}
    >
      <MapContainer
        center={[20, 0]} // roughly the center of the world
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        key={theme} // Force remount when theme changes
      >
        <TileLayer
          attribution={tileLayerAttribution}
          url={tileLayerUrl}
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
              <Box sx={{ 
                p: 1,
                backgroundColor: theme === 'dark' ? '#2d2d2d' : '#FFFFFF',
                color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
              }}>
                <Typography 
                  variant="subtitle1"
                  sx={{ 
                    fontWeight: 'bold',
                    color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                    mb: 1
                  }}
                >
                  {post.title}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(`/api/posts/${post._id}`)}
                  sx={{ 
                    cursor: 'pointer',
                    borderColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                    color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                    '&:hover': {
                      backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                      color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
                      borderColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                    },
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    p: '2px 8px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  View Post
                </Button>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default PostsMap;