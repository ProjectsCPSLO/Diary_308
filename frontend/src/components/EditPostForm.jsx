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

  useEffect(() => {
    if (!open) {
      setIsPasswordVerified(!post.password);
      setPassword('');
      setPasswordError('');
      setTitle(post.title);
      setContent(post.content);
      setDate(new Date(post.date).toISOString().split('T')[0]);
      setLocation(post.location || null);
    }
  }, [open, post]);

  const handlePasswordVerify = async (e) => {
    e.preventDefault();
    setPasswordError('');

    try {
      const response = await fetch(
        `https://diary-backend-d7dxfjbpe8g0cchj.westus3-01.azurewebsites.net/api/posts/${post._id}/verify`,
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
      location,
    };

    try {
      const response = await fetch(
        `https://diary-backend-d7dxfjbpe8g0cchj.westus3-01.azurewebsites.net/api/posts/${post._id}`,
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

          {/* Geotag component for editing location */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Edit Location</Typography>
            <GeotagLocation initialPosition={location} onLocationSelect={setLocation} />
          </Box>
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
