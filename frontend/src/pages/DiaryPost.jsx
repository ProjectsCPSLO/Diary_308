import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Container
} from '@mui/material';
// Import Leaflet components for map preview
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const DiaryPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(true);

  // Password verification attempt
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(
        `https://diary-backend-d7dxfjbpe8g0cchj.westus3-01.azurewebsites.net/api/posts/${id}/verify`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        }
      );
      const json = await response.json();
      if (!response.ok) {
        setError(json.error || 'Failed to verify password');
        return;
      }
      setPost(json);
      setPasswordRequired(false);
      setPassword('');
    } catch (err) {
      setError('Error verifying password');
    }
  };

  // Initial load
  useEffect(() => {
    if (user && id) {
      const checkPost = async () => {
        try {
          const response = await fetch(
            `https://diary-backend-d7dxfjbpe8g0cchj.westus3-01.azurewebsites.net/api/posts/${id}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          const json = await response.json();
          if (!response.ok) {
            if (json.isPasswordProtected) {
              setPasswordRequired(true);
              setPost(null);
            } else {
              setError(json.error);
              setPost(null);
            }
          } else {
            setPost(json);
            setPasswordRequired(false);
          }
        } catch (err) {
          setError('Failed to load post');
        } finally {
          setIsLoading(false);
        }
      };
      checkPost();
    }
  }, [id, user]);


  if (isLoading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0, // Change from fixed dimensions to cover full viewport
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999, // Ensure it's above everything else
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme === 'dark' ? '#1c1c1c' : '#FFFFFF',
        }}
      >
        <CircularProgress size={80} sx={{ 
          color: theme === 'dark' ? '#93A8AC' : '#0D3B66' 
        }} />
      </Box>
    );
  }

  // Select appropriate map tile layer based on theme
  const tileLayerUrl = theme === 'dark' 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' 
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  
  const tileLayerAttribution = theme === 'dark'
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 64, // Updated to match navbar height
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme === 'dark' ? '#1c1c1c' : '#FFFFFF',
        color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
        overflowY: 'auto', // Enable scrolling for long content
        padding: '2rem',
        transition: 'background-color 0.3s ease',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: theme === 'dark' ? '#2d2d2d' : '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme === 'dark' ? '#93A8AC' : '#0D3B66',
          borderRadius: '4px',
        },
      }}
    >
      <Container maxWidth="md" sx={{ py: 4 }}>
        {passwordRequired ? (
          <Paper
            elevation={3}
            sx={{
              padding: '2rem',
              maxWidth: '400px',
              textAlign: 'center',
              backgroundColor: theme === 'dark' ? '#2d2d2d' : '#FFFFFF',
              color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
              margin: '0 auto',
              borderRadius: '12px',
              boxShadow: theme === 'dark' 
                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: theme === 'dark' ? '1px solid #444' : 'none',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              This post is password-protected
            </Typography>
            <form onSubmit={handlePasswordSubmit}>
              <TextField
                label="Enter Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!error}
                helperText={error}
                sx={{
                  marginBottom: '1.5rem',
                  '& .MuiInputBase-input': {
                    color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                  },
                  '& .MuiInputLabel-root': {
                    color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.3)' : 'rgba(13, 59, 102, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                    },
                  },
                }}
              />
              <Button 
                type="submit" 
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                  color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
                  '&:hover': {
                    backgroundColor: theme === 'dark' ? '#FFFFFF' : '#093057',
                  },
                  fontWeight: 500,
                  padding: '10px 0',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                }}
              >
                Unlock Post
              </Button>
            </form>
          </Paper>
        ) : (
          <Card
            sx={{
              width: '100%',
              padding: {xs: '1.5rem', sm: '2rem'},
              borderRadius: '12px',
              backgroundColor: theme === 'dark' ? '#2d2d2d' : '#FFFFFF',
              color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
              boxShadow: theme === 'dark' 
                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: theme === 'dark' ? '1px solid #444' : 'none',
            }}
          >
            <CardContent>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 2,
                  color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                }}
              >
                {post?.title}
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 3, 
                  color: theme === 'dark' ? '#93A8AC' : 'rgba(13, 59, 102, 0.7)',
                  fontWeight: 500
                }}
              >
                {post?.date && new Date(post.date).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                })}
              </Typography>
              
              {/* Content section */}
              <Box 
                sx={{ 
                  mb: 4,
                  '& p': {
                    color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                    fontSize: '1rem',
                    lineHeight: 1.7
                  },
                  '& a': {
                    color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                    textDecoration: 'underline'
                  },
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '4px',
                    my: 2
                  }
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: post?.content }} />
              </Box>
              
              {/* Tags section */}
              {post?.tags && post.tags.length > 0 && (
                <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {post.tags.map((tag, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      sx={{
                        display: 'inline-block',
                        backgroundColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.1)' : 'rgba(13, 59, 102, 0.1)',
                        color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                        borderRadius: '16px',
                        px: 2,
                        py: 0.5,
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        border: `1px solid ${theme === 'dark' ? 'rgba(147, 168, 172, 0.3)' : 'rgba(13, 59, 102, 0.2)'}`,
                      }}
                    >
                      {tag}
                    </Typography>
                  ))}
                </Box>
              )}
              
              {/* Display the location if it exists */}
              {post?.location && (
                <Box sx={{ mt: 4, height: '400px', width: '100%' }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      mb: 2,
                      color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                    }}
                  >
                    Location
                  </Typography>
                  <Box 
                    sx={{ 
                      height: '100%', 
                      width: '100%', 
                      borderRadius: '12px', 
                      overflow: 'hidden',
                      border: `1px solid ${theme === 'dark' ? 'rgba(147, 168, 172, 0.3)' : 'rgba(13, 59, 102, 0.2)'}`,
                    }}
                  >
                    <MapContainer
                      center={[post.location.lat, post.location.lng]}
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                      key={theme} // Force remount when theme changes
                    >
                      <TileLayer
                        attribution={tileLayerAttribution}
                        url={tileLayerUrl}
                      />
                      <Marker position={[post.location.lat, post.location.lng]}>
                        <Popup>{post.title}</Popup>
                      </Marker>
                    </MapContainer>
                  </Box>
                  
                  {/* Add a note about map source */}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block',
                      mt: 1,
                      color: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(13, 59, 102, 0.6)',
                      textAlign: 'right'
                    }}
                  >
                    Map data © OpenStreetMap contributors
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default DiaryPost;