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
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ThemeContext } from '../context/ThemeContext';
import WritingPrompts from './WritingPrompts';
import TagsInput from './TagsInput';

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
        dispatch({ type: 'CREATE_POST', payload: json });
      } else {
        setError('submit', { message: json.error || 'An error occurred.' });
      }
    } catch (err) {
      setError('submit', { message: 'An unexpected error occurred.' });
    }
  };

  return (
    <Box
      sx={{
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto',
        paddingBottom: '20px',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: theme === 'dark' ? '#1e1e1e' : '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme === 'dark' ? '#888' : '#c1c1c1',
          borderRadius: '4px',
        },
      }}
    >
      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            maxWidth: '400px',
            p: 3,
            boxShadow:
              theme === 'dark'
                ? '0px 4px 6px rgba(0, 0, 0, 0.5)'
                : '0px 2px 4px rgba(0, 0, 0, 0.2)',
            borderRadius: 2,
            backgroundColor: theme === 'dark' ? '#424242' : '#fff',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            margin: '0 auto',
            marginTop: '20px',
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Create a Post
          </Typography>

          <WritingPrompts onSelectPrompt={handlePromptSelect} />

          {currentPrompt && (
            <Alert
              severity="info"
              sx={{
                mb: 2,
                backgroundColor: theme === 'dark' ? '#1e3a5f' : '#e3f2fd',
                color: theme === 'dark' ? '#90caf9' : '#1976d2',
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
                color: theme === 'dark' ? '#90caf9' : '#000',
              },
            }}
            InputLabelProps={{
              style: { color: theme === 'dark' ? '#90caf9' : '#000' },
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
                color: theme === 'dark' ? '#90caf9' : '#000',
              },
            }}
            InputLabelProps={{
              style: { color: theme === 'dark' ? '#90caf9' : '#000' },
              shrink: true,
            }}
          />

          <Box sx={{ minHeight: '200px' }}>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={(value) => setContent(value)}
              modules={editorModules}
              formats={editorFormats}
              style={{
                backgroundColor: theme === 'dark' ? '#fff' : '#fff',
                color: theme === 'dark' ? '#424242' : '#000',
                height: '150px',
              }}
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel>Mood</InputLabel>
            <Select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              label="Mood"
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
          />

          <TagsInput tags={tags} setTags={setTags} theme={theme} />

          {errors.submit && (
            <Typography variant="body2" color="error" align="center">
              {errors.submit.message}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            POST
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PostForm;