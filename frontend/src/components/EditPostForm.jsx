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
            backgroundColor: theme === 'dark' ? '#2d2d2d' : '#FFFFFF',
            color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
            borderRadius: '12px',
            boxShadow: theme === 'dark' 
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: theme === 'dark' ? '1px solid #444' : 'none',
          },
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 'bold',
          color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
          borderBottom: `1px solid ${theme === 'dark' ? 'rgba(147, 168, 172, 0.2)' : 'rgba(13, 59, 102, 0.1)'}`,
          p: 3
        }}>
          Password Required
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, color: theme === 'dark' ? '#FFFFFF' : '#0D3B66' }}>
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
                '& .MuiFormHelperText-root.Mui-error': {
                  color: theme === 'dark' ? '#e57373' : '#d32f2f',
                },
              }}
            />
            <Box
              sx={{
                mt: 3,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
              }}
            >
              <Button 
                onClick={onClose} 
                sx={{ 
                  color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                  '&:hover': {
                    backgroundColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.1)' : 'rgba(13, 59, 102, 0.05)',
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                sx={{
                  backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                  color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
                  '&:hover': {
                    backgroundColor: theme === 'dark' ? '#FFFFFF' : '#093057',
                  },
                  fontWeight: 500,
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                }}
              >
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
          backgroundColor: theme === 'dark' ? '#2d2d2d' : '#FFFFFF',
          color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
          borderRadius: '12px',
          boxShadow: theme === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: theme === 'dark' ? '1px solid #444' : 'none',
        },
      }}
    >
      <DialogTitle sx={{ 
        fontWeight: 'bold',
        color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
        borderBottom: `1px solid ${theme === 'dark' ? 'rgba(147, 168, 172, 0.2)' : 'rgba(13, 59, 102, 0.1)'}`,
        p: 3
      }}>
        Edit Post
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            sx={{
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

          <Box sx={{ mt: 2, mb: 4 }}>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={(value) => setContent(value)}
              style={{
                height: '200px',
                marginBottom: '40px',
              }}
              className={theme === 'dark' ? 'dark-quill-editor' : ''}
            />
            {/* Custom CSS for dark mode styling of the rich text editor */}
            {theme === 'dark' && (
              <style jsx global>{`
                .dark-quill-editor .ql-toolbar {
                  background-color: #444;
                  border-color: #555 !important;
                  color: white;
                }
                .dark-quill-editor .ql-toolbar .ql-stroke {
                  stroke: #93A8AC;
                }
                .dark-quill-editor .ql-toolbar .ql-fill {
                  fill: #93A8AC;
                }
                .dark-quill-editor .ql-toolbar .ql-picker {
                  color: #93A8AC;
                }
                .dark-quill-editor .ql-toolbar .ql-picker-options {
                  background-color: #444;
                }
                .dark-quill-editor .ql-container {
                  border-color: #555 !important;
                  background-color: #333;
                  color: white;
                }
                .dark-quill-editor .ql-editor.ql-blank::before {
                  color: #93A8AC;
                }
              `}</style>
            )}
          </Box>

          {/* Toggle for Geotag */}
          <Box sx={{ 
            mt: 2,
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            borderTop: `1px solid ${theme === 'dark' ? 'rgba(147, 168, 172, 0.2)' : 'rgba(13, 59, 102, 0.1)'}`,
            paddingTop: 2
          }}>
            <FormControlLabel
              control={
                <Switch
                  checked={geotagEnabled}
                  onChange={handleGeotagToggle}
                  sx={{
                    '& .MuiSwitch-switchBase': {
                      '&.Mui-checked': {
                        color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                        '& + .MuiSwitch-track': {
                          backgroundColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.5)' : 'rgba(13, 59, 102, 0.5)',
                        },
                      },
                    },
                    '& .MuiSwitch-thumb': {
                      backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                    },
                  }}
                />
              }
              label="Geotag Location"
              sx={{
                color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                '& .MuiFormControlLabel-label': {
                  fontWeight: 500,
                }
              }}
            />
          </Box>

          {/* Show location selection only if geotagging is enabled */}
          {geotagEnabled && (
            <Box sx={{ mt: 2 }}>
              <GeotagLocation
                key={location ? `${location.lat}-${location.lng}` : 'no-location'}
                initialPosition={location}
                onLocationSelect={setLocation}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        p: 3,
        borderTop: `1px solid ${theme === 'dark' ? 'rgba(147, 168, 172, 0.2)' : 'rgba(13, 59, 102, 0.1)'}`,
      }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
            '&:hover': {
              backgroundColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.1)' : 'rgba(13, 59, 102, 0.05)',
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          sx={{
            backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
            color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
            '&:hover': {
              backgroundColor: theme === 'dark' ? '#FFFFFF' : '#093057',
            },
            fontWeight: 500,
            borderRadius: '8px',
            transition: 'all 0.2s ease',
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPostForm;