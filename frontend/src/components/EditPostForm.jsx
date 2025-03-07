// frontend/src/components/EditPostForm.jsx
import React, { useState, useEffect } from 'react';
import { usePostsContext } from '../hooks/usePostsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControlLabel,
  Switch,
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import GeotagLocation from './GeotagLocation.jsx';

const EditPostForm = ({ post, open, onClose, theme }) => {
  const { dispatch } = usePostsContext();
  const { user } = useAuthContext();

  const [isPasswordVerified, setIsPasswordVerified] = useState(!post.password);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [date, setDate] = useState(new Date(post.date).toISOString().split('T')[0]);
  const [location, setLocation] = useState(post.location || null);
  const [geotagEnabled, setGeotagEnabled] = useState(!!post.location);

  useEffect(() => {
    if (!open) {
      setIsPasswordVerified(!post.password);
      setPassword('');
      setPasswordError('');
      setTitle(post.title);
      setContent(post.content);
      setDate(new Date(post.date).toISOString().split('T')[0]);
      setLocation(post.location || null);
      setGeotagEnabled(!!post.location);
    }
  }, [open, post]);

  const handlePasswordVerify = async (e) => {
    e.preventDefault();
    setPasswordError('');

    try {
      const response = await fetch(
        `http://localhost:4000/api/posts/${post._id}/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      const json = await response.json();

      if (response.ok) {
        setIsPasswordVerified(true);
        setPassword('');
      } else {
        setPasswordError(json.error || 'Incorrect password');
      }
    } catch (error) {
      setPasswordError('Error verifying password');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPost = {
      title,
      content,
      date,
      location: geotagEnabled ? location : null,
    };

    try {
      const response = await fetch(
        `http://localhost:4000/api/posts/${post._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(updatedPost),
        }
      );

      const json = await response.json();

      if (response.ok) {
        const completeUpdatedPost = {
          ...post,
          ...updatedPost,
        };

        dispatch({ type: 'UPDATE_POST', payload: completeUpdatedPost });
        onClose();
      } else {
        console.error('Failed to update post:', json);
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleGeotagToggle = (e) => {
    const enabled = e.target.checked;
    setGeotagEnabled(enabled);
    if (!enabled) {
      setLocation(null);
    } else {
      if (!location && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setLocation(userPos);
          },
          (err) => {
            console.error('Error retrieving location:', err);
          }
        );
      }
    }
  };

  if (!isPasswordVerified) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            backgroundColor: theme === 'dark' ? '#424242' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
          },
        }}
      >
        <DialogTitle>Password Required</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This post is password protected. Please enter the password to edit.
          </Typography>
          <form onSubmit={handlePasswordVerify}>
            <TextField
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              fullWidth
              sx={{
                '& .MuiInputBase-input': {
                  color: theme === 'dark' ? '#fff' : '#000',
                },
                '& .MuiInputLabel-root': {
                  color: theme === 'dark' ? '#fff' : '#000',
                },
              }}
            />
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
              }}
            >
              <Button onClick={onClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Verify
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: theme === 'dark' ? '#424242' : '#fff',
          color: theme === 'dark' ? '#fff' : '#000',
        },
      }}
    >
      <DialogTitle>Edit Post</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            sx={{
              '& .MuiInputBase-input': {
                color: theme === 'dark' ? '#fff' : '#000',
              },
              '& .MuiInputLabel-root': {
                color: theme === 'dark' ? '#fff' : '#000',
              },
            }}
          />

          <TextField
            type="date"
            fullWidth
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiInputBase-input': {
                color: theme === 'dark' ? '#fff' : '#000',
              },
              '& .MuiInputLabel-root': {
                color: theme === 'dark' ? '#fff' : '#000',
              },
            }}
          />

          <ReactQuill
            theme="snow"
            value={content}
            onChange={(value) => setContent(value)}
            style={{
              backgroundColor: '#fff',
              color: theme === 'dark' ? '#000' : '#000',
              border: theme === 'dark' ? '1px solid #6c757d' : '1px solid #ccc',
              borderRadius: '4px',
              minHeight: '150px',
              padding: '10px',
            }}
          />

          {/* Toggle for Geotag */}
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={geotagEnabled}
                  onChange={handleGeotagToggle}
                  color="primary"
                />
              }
              label="Geotag?"
            />
          </Box>

                    {/* Show location selection only if geotagging is enabled */}
                    {geotagEnabled && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Update Location</Typography>
              <GeotagLocation
  key={location ? `${location.lat}-${location.lng}` : 'no-location'}
  initialPosition={location}
  onLocationSelect={setLocation}
/>

            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPostForm;
