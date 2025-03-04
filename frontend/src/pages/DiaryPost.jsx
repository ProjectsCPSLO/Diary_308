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
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        bottom: 0,
        minHeight: '100vh',
        backgroundColor: theme === 'dark' ? '#1c1c1c' : 'white',
        color: theme === 'dark' ? 'white' : 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        transition: 'background-color 0.3s ease',
      }}
    >
      {passwordRequired ? (
        <Paper
          elevation={3}
          sx={{
            padding: '2rem',
            maxWidth: '400px',
            textAlign: 'center',
            backgroundColor: theme === 'dark' ? '#424242' : 'white',
            color: theme === 'dark' ? 'white' : 'black',
          }}
        >
          <Typography variant="h6" gutterBottom>
            This post is password-protected.
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
                marginBottom: '1rem',
                backgroundColor: theme === 'dark' ? '#616161' : 'inherit',
                '& .MuiInputBase-input': {
                  color: theme === 'dark' ? '#fff' : 'inherit',
                },
                '& .MuiInputLabel-root': {
                  color: theme === 'dark' ? '#fff' : 'inherit',
                },
              }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </form>
        </Paper>
      ) : (
        <Card
          sx={{
            maxWidth: '800px',
            padding: '2rem',
            borderRadius: '8px',
            backgroundColor: theme === 'dark' ? '#424242' : '#f5f5f5',
            color: theme === 'dark' ? '#fff' : '#000',
            boxShadow:
              theme === 'dark'
                ? '0px 4px 6px rgba(0, 0, 0, 0.5)'
                : '0px 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {post?.title}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {post?.date && new Date(post.date).toLocaleString()}
            </Typography>
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: post?.content }} />
            {/* Display the location if it exists */}
            {post?.location && (
              <Box sx={{ mt: 2, height: '300px' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Location:
                </Typography>
                <MapContainer
                  center={[post.location.lat, post.location.lng]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[post.location.lat, post.location.lng]}>
                    <Popup>Selected Location</Popup>
                  </Marker>
                </MapContainer>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DiaryPost;
