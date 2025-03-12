import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePostsContext } from '../hooks/usePostsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { ThemeContext } from '../context/ThemeContext';
import MoodIcon from '@mui/icons-material/Mood';
import {
  ListItem,
  Typography,
  IconButton,
  Stack,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItemText,
  Checkbox,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import EditPostForm from './EditPostForm';

// Import Leaflet components & CSS
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// If you run into marker icon issues, also do the Leaflet icon fix:
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const PostHead = ({ post, mapTileUrl, mapTileAttribution, themeKey }) => {
  const { dispatch } = usePostsContext();
  const { user } = useAuthContext();
  const { theme } = useContext(ThemeContext);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [sharedWith, setSharedWith] = useState(post.sharedWith || []);

  // Default map tile settings if not provided as props
  const defaultTileUrl = theme === 'dark' 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' 
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  
  const defaultTileAttribution = theme === 'dark'
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return "Invalid date";
      }
      
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date error";
    }
  };

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const response = await fetch(
          'https://diary-backend-d7dxfjbpe8g0cchj.westus3-01.azurewebsites.net/api/user/collaborators',
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const json = await response.json();
        if (response.ok) {
          setCollaborators(json);
        }
      } catch (error) {
        console.error('Error fetching collaborators:', error);
      }
    };

    fetchCollaborators();
  }, [user]);

  const handleClick = async () => {
    const response = await fetch(
      `https://diary-backend-d7dxfjbpe8g0cchj.westus3-01.azurewebsites.net/api/posts/${post._id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    if (response.ok) {
      await response.json();
      dispatch({ type: 'DELETE_POST', payload: post._id });
      console.log('Post deleted:', post._id);
    } else {
      console.error('Failed to delete post:', response.statusText);
    }
  };

  const handleShare = async () => {
    try {
      const newCollaborators = selectedCollaborators.filter(
        (id) => !sharedWith.includes(id)
      );

      if (newCollaborators.length === 0) {
        setShareDialogOpen(false);
        setNotification({
          open: true,
          message: 'No new collaborators to share with',
          severity: 'info',
        });
        return;
      }

      const response = await fetch(
        `https://diary-backend-d7dxfjbpe8g0cchj.westus3-01.azurewebsites.net/api/posts/${post._id}/share`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            collaboratorIds: newCollaborators,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSharedWith(data.sharedWith);
        setShareDialogOpen(false);
        setSelectedCollaborators([]);
        setNotification({
          open: true,
          message: 'Post shared successfully!',
          severity: 'success',
        });
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      setNotification({
        open: true,
        message: 'Error sharing post',
        severity: 'error',
      });
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setEditDialogOpen(true);
  };

  // Updated styles with the new color scheme
  const postStyle = {
    backgroundColor: theme === 'dark' ? '#2d2d2d' : '#fff',
    color: theme === 'dark' ? '#fff' : '#0D3B66',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: theme === 'dark' 
      ? '0 4px 20px rgba(0,0,0,0.3)'
      : '0 4px 20px rgba(0,0,0,0.08)',
    border: 'none',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease, color 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '200px',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme === 'dark' 
        ? '0 10px 25px rgba(0,0,0,0.4)'
        : '0 10px 25px rgba(0,0,0,0.1)',
    }
  };

  const titleStyle = {
    color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    width: '100%',
    textAlign: 'left',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
    },
  };

  const dateStyle = {
    color: theme === 'dark' ? '#aaa' : '#666',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    textAlign: 'left',
    width: '100%',
  };

  const contentStyle = {
    color: theme === 'dark' ? '#f5f5f5' : '#333',
    fontSize: '1rem',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    flex: 1,
    textAlign: 'left',
    width: '100%',
    lineHeight: 1.5,
  };

  const moodStyle = {
    color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    justifyContent: 'flex-start',
    marginBottom: '0.5rem',
  };

  return (
    <>
      <ListItem sx={postStyle}>
        <Stack direction="column" spacing={1} sx={{ height: '100%', width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
            <Typography
              component={Link}
              to={`/api/posts/${post._id}`}
              sx={titleStyle}
            >
              {post.title}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, ml: 2, flexShrink: 0 }}>
              <IconButton
                onClick={() => setShareDialogOpen(true)}
                sx={{
                  color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                  '&:hover': {
                    backgroundColor:
                      theme === 'dark'
                        ? 'rgba(147, 168, 172, 0.2)'
                        : 'rgba(13, 59, 102, 0.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
                size="small"
              >
                <ShareIcon fontSize="small" />
              </IconButton>

              <IconButton
                onClick={handleEditClick}
                sx={{
                  color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                  '&:hover': {
                    backgroundColor:
                      theme === 'dark'
                        ? 'rgba(147, 168, 172, 0.2)'
                        : 'rgba(13, 59, 102, 0.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
                size="small"
              >
                <EditIcon fontSize="small" />
              </IconButton>

              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                sx={{
                  color: theme === 'dark' ? '#e57373' : '#d32f2f',
                  '&:hover': {
                    backgroundColor:
                      theme === 'dark'
                        ? 'rgba(229, 115, 115, 0.2)'
                        : 'rgba(211, 47, 47, 0.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Typography variant="body2" sx={dateStyle}>
            {formatDateTime(post.date)}
          </Typography>

          <Box sx={moodStyle}>
            <MoodIcon fontSize="small" sx={{ color: theme === 'dark' ? '#93A8AC' : '#0D3B66' }} />
            <span>{post.mood}</span>
          </Box>

          <Typography
            variant="body1"
            sx={contentStyle}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags && post.tags.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                mt: 1,
                width: '100%',
                justifyContent: 'flex-start',
              }}
            >
              {post.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    backgroundColor: theme === 'dark' 
                      ? 'rgba(147, 168, 172, 0.1)' 
                      : 'rgba(13, 59, 102, 0.1)',
                    color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                    borderColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                    '&:hover': {
                      backgroundColor: theme === 'dark' 
                        ? 'rgba(147, 168, 172, 0.2)' 
                        : 'rgba(13, 59, 102, 0.2)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </Box>
          )}

          {/* Embed a small map if there's a location */}
          {post.location && (
            <Box sx={{ 
              width: '100%', 
              height: '150px', 
              mt: 2,
              borderRadius: '8px',
              overflow: 'hidden',
              border: theme === 'dark' 
                ? '1px solid rgba(147, 168, 172, 0.3)' 
                : '1px solid rgba(13, 59, 102, 0.2)',
            }}>
              <MapContainer
                center={[post.location.lat, post.location.lng]}
                zoom={13}
                style={{ width: '100%', height: '100%' }}
                scrollWheelZoom={false}
                dragging={false}
                zoomControl={false}
                key={themeKey || theme} // Force remount when theme changes
              >
                <TileLayer
                  attribution={mapTileAttribution || defaultTileAttribution}
                  url={mapTileUrl || defaultTileUrl}
                />
                <Marker position={[post.location.lat, post.location.lng]}>
                  <Popup>{post.title}</Popup>
                </Marker>
              </MapContainer>
            </Box>
          )}
        </Stack>
      </ListItem>

      <EditPostForm
        post={post}
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        theme={theme}
      />

      <Dialog
        open={shareDialogOpen}
        onClose={() => {
          setShareDialogOpen(false);
          setSelectedCollaborators([]);
        }}
        PaperProps={{
          sx: {
            backgroundColor: theme === 'dark' ? '#2d2d2d' : '#FFFFFF',
            color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
            borderRadius: '12px',
          },
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${theme === 'dark' ? 'rgba(147, 168, 172, 0.2)' : 'rgba(13, 59, 102, 0.1)'}`,
          padding: '16px 24px',
        }}>
          Share with Collaborators
        </DialogTitle>
        <DialogContent sx={{ padding: '24px' }}>
          {collaborators.length > 0 ? (
            <List>
              {collaborators.map((collaborator) => (
                <ListItem key={collaborator._id}>
                  <Checkbox
                    checked={
                      selectedCollaborators.includes(collaborator._id) ||
                      sharedWith.includes(collaborator._id)
                    }
                    disabled={sharedWith.includes(collaborator._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCollaborators([
                          ...selectedCollaborators,
                          collaborator._id,
                        ]);
                      } else {
                        setSelectedCollaborators(
                          selectedCollaborators.filter(
                            (id) => id !== collaborator._id
                          )
                        );
                      }
                    }}
                    sx={{
                      color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                      '&.Mui-checked': {
                        color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                      },
                      '&.Mui-disabled': {
                        color: theme === 'dark' ? '#666' : '#bbb',
                      },
                    }}
                  />
                  <ListItemText
                    primary={collaborator.email}
                    secondary={
                      sharedWith.includes(collaborator._id)
                        ? ''
                        : ''
                    }
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                      },
                      '& .MuiListItemText-secondary': {
                        color: theme === 'dark' ? '#93A8AC' : '#666',
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography sx={{ color: theme === 'dark' ? '#FFFFFF' : '#0D3B66' }}>
              No collaborators yet. Add them in your profile.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          padding: '16px 24px', 
          borderTop: `1px solid ${theme === 'dark' ? 'rgba(147, 168, 172, 0.2)' : 'rgba(13, 59, 102, 0.1)'}`,
        }}>
          <Button
            onClick={() => {
              setShareDialogOpen(false);
              setSelectedCollaborators([]);
            }}
            sx={{ 
              color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
              '&:hover': {
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(13, 59, 102, 0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleShare}
            variant="contained"
            disabled={
              selectedCollaborators.length === 0 ||
              selectedCollaborators.every((id) => sharedWith.includes(id))
            }
            sx={{
              backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
              color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
              '&:hover': {
                backgroundColor: theme === 'dark' ? '#FFFFFF' : '#093057',
              },
              '&.Mui-disabled': {
                backgroundColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.3)' : 'rgba(13, 59, 102, 0.3)',
              },
            }}
          >
            Share
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ 
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backgroundColor: theme === 'dark' ? '#2d2d2d' : '#FFFFFF',
            color: notification.severity === 'success' 
              ? (theme === 'dark' ? '#81c784' : '#2e7d32')
              : notification.severity === 'error'
              ? (theme === 'dark' ? '#e57373' : '#d32f2f')
              : notification.severity === 'info'
              ? (theme === 'dark' ? '#93A8AC' : '#0D3B66')
              : (theme === 'dark' ? '#ffb74d' : '#ed6c02'),
            '& .MuiAlert-icon': {
              color: notification.severity === 'success' 
                ? (theme === 'dark' ? '#81c784' : '#2e7d32')
                : notification.severity === 'error'
                ? (theme === 'dark' ? '#e57373' : '#d32f2f')
                : notification.severity === 'info'
                ? (theme === 'dark' ? '#93A8AC' : '#0D3B66')
                : (theme === 'dark' ? '#ffb74d' : '#ed6c02'),
            }
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PostHead;