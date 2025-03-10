import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePostsContext } from '../hooks/usePostsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import {
  Box,
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
  Select,
  InputLabel,
  FormControl,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ThemeContext } from '../context/ThemeContext';
import WritingPrompts from './WritingPrompts';
import TagsInput from './TagsInput';
import GeotagLocation from './GeotagLocation';

const PostForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm();
  const { dispatch } = usePostsContext();
  const { user } = useAuthContext();
  const { theme } = useContext(ThemeContext);

  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [password, setPassword] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [tags, setTags] = useState([]);

  // New state for the selected location
  const [location, setLocation] = useState(null);
  // Toggle to control if geotagging is enabled
  const [geotagEnabled, setGeotagEnabled] = useState(true);

  const editorModules = {
    toolbar: [
      [{ font: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const editorFormats = [
    'font',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'align',
    'link',
    'image',
  ];

  const handlePromptSelect = (prompt) => {
    setCurrentPrompt(prompt);
  };

  // When the geotag toggle changes, update the location state accordingly.
  const handleGeotagToggle = (e) => {
    const enabled = e.target.checked;
    setGeotagEnabled(enabled);
    if (!enabled) {
      // User doesn't want to geotag: clear location.
      setLocation(null);
    } else {
      // If enabling and no location is set, try to get the user's current location.
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

  const onSubmit = async (data) => {
    const dateParts = data.date.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; 
    const day = parseInt(dateParts[2], 10);
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const localDate = new Date(year, month, day, hours, minutes, seconds);
    
    console.log('Form date selected:', data.date);
    console.log('Created post date-time:', localDate.toLocaleString());
    console.log('Tags before submission:', tags);
    
    const post = {
      date: localDate.toISOString(),
      title: data.title,
      content: content,
      mood: mood,
      password: data.password ? data.password : null,
      tags: tags,
      location: geotagEnabled ? location : null,
    };
    
    console.log('Full post data:', post);
    try {
      const response = await fetch('https://diary-backend-d7dxfjbpe8g0cchj.westus3-01.azurewebsites.net/api/posts', {
        method: 'POST',
        body: JSON.stringify(post),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        reset({ title: '', date: '', password: '' });
        setContent('');
        setMood('neutral');
        setCurrentPrompt('');
        setTags([]);
        // Clear location only if geotagging is enabled; otherwise, leave it as null.
        if (geotagEnabled) {
          setLocation(null);
        }
        dispatch({ type: 'CREATE_POST', payload: json });
      } else {
        setError('submit', { message: json.error || 'An error occurred.' });
      }
    } catch (err) {
      setError('submit', { message: 'An unexpected error occurred.' });
    }
  };

  return (
    <Box sx={{ paddingBottom: '20px' }}>
      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            maxWidth: '95%',
            p: 3,
            boxShadow: theme === 'dark' 
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
            borderRadius: 3,
            backgroundColor: theme === 'dark' ? '#2d2d2d' : '#fff',
            transition: 'all 0.3s ease',
            margin: '0 auto',
            marginTop: '20px',
            border: theme === 'dark' ? '1px solid #444' : 'none',
          }}
        >
          <WritingPrompts 
            onSelectPrompt={handlePromptSelect} 
            customColors={{
              buttonColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
              textColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
              hoverBg: theme === 'dark' ? 'rgba(147, 168, 172, 0.1)' : 'rgba(13, 59, 102, 0.05)',
            }}
          />
  
          {currentPrompt && (
            <Alert
              severity="info"
              sx={{
                mb: 2,
                backgroundColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.1)' : 'rgba(13, 59, 102, 0.05)',
                color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                '& .MuiAlert-icon': {
                  color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                },
                borderRadius: '8px',
              }}
            >
              Prompt: {currentPrompt}
            </Alert>
          )}
  
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            {...register('title', { required: 'Title is required' })}
            error={!!errors.title}
            helperText={errors.title?.message}
            InputProps={{
              style: {
                color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
              },
            }}
            InputLabelProps={{
              style: { color: theme === 'dark' ? '#93A8AC' : '#0D3B66' },
            }}
            sx={{
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
            label="Date"
            type="date"
            variant="outlined"
            fullWidth
            defaultValue={new Date().toISOString().split('T')[0]} 
            {...register('date', { required: 'Date is required' })}
            error={!!errors.date}
            helperText={errors.date?.message}
            InputProps={{
              style: {
                color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
              },
            }}
            InputLabelProps={{
              style: { color: theme === 'dark' ? '#93A8AC' : '#0D3B66' },
              shrink: true,
            }}
            sx={{
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
  
          <Box sx={{ minHeight: '250px', mb: 4 }}>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={(value) => setContent(value)}
              modules={editorModules}
              formats={editorFormats}
              style={{
                height: '200px',
                width: '100%',
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
  
          <FormControl fullWidth>
            <InputLabel sx={{ color: theme === 'dark' ? '#93A8AC' : '#0D3B66' }}>Mood</InputLabel>
            <Select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              label="Mood"
              sx={{
                color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.3)' : 'rgba(13, 59, 102, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                },
                '& .MuiSvgIcon-root': {
                  color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                },
              }}
            >
              <MenuItem value="Happy">Happy</MenuItem>
              <MenuItem value="Sad">Sad</MenuItem>
              <MenuItem value="Excited">Excited</MenuItem>
              <MenuItem value="Anxious">Anxious</MenuItem>
              <MenuItem value="Neutral">Neutral</MenuItem>
            </Select>
          </FormControl>
  
          <TextField
            label="Password (Optional)"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            {...register('password')}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Add a password to protect your post (optional)"
            InputProps={{
              style: {
                color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
              },
            }}
            InputLabelProps={{
              style: { color: theme === 'dark' ? '#93A8AC' : '#0D3B66' },
            }}
            FormHelperTextProps={{
              style: { color: theme === 'dark' ? '#93A8AC' : 'rgba(13, 59, 102, 0.7)' },
            }}
            sx={{
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
  
                    <Box sx={{ 
            mb: 2,
            '& .MuiTextField-root': {
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme === 'dark' ? '#3a3a3a' : '#f5f5f5',
                color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                '&:hover fieldset': {
                  borderColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                },
                '& fieldset': {
                  borderColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.3)' : 'rgba(13, 59, 102, 0.3)',
                }
              },
              '& .MuiInputLabel-root': {
                color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
              }
            },
            '& .MuiChip-root': {
              backgroundColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.2)' : 'rgba(13, 59, 102, 0.1)',
              color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
              borderColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
              '& .MuiChip-deleteIcon': {
                color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                '&:hover': {
                  color: theme === 'dark' ? '#FFFFFF' : '#000000',
                }
              }
            }
          }}>
            <TagsInput tags={tags} setTags={setTags} theme={theme} />
          </Box>
  
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            borderTop: `1px solid ${theme === 'dark' ? 'rgba(147, 168, 172, 0.2)' : 'rgba(13, 59, 102, 0.1)'}`,
            paddingTop: 2,
            mb: 1 // Add a small margin bottom to reduce gap
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
          {/* Only render GeotagLocation if geotag is enabled */}
          {geotagEnabled && (
            <Box sx={{ 
              mb: 2, // Add margin bottom to reduce gap
              '& > div': { // Target the direct child div of the GeotagLocation component
                gap: 1,
              }
            }}>
              <GeotagLocation 
                onLocationSelect={setLocation} 
                initialPosition={location}
                theme={theme} // Pass theme to allow styling customization
              />
            </Box>
          )}

          {errors.submit && (
            <Typography variant="body2" color="error" align="center">
              {errors.submit.message}
            </Typography>
          )}
  
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ 
              mt: 2,
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
            POST
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PostForm;