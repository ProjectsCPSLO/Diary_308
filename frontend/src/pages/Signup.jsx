import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useSignup } from '../hooks/useSignup.js';
import {
  Container,
  Box,
  TextField,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { ThemeContext } from '../context/ThemeContext'; // Import ThemeContext

const Signup = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { signup, loading, error } = useSignup();
  const { theme } = useContext(ThemeContext); // Access theme from context

  const onSubmit = async (data) => {
    await signup(data.email, data.password);
    reset({ email: '', password: '' });
  };

  return (
    <Box
      sx={{
        position: 'fixed', // Ensures the Box spans the entire viewport
        top: 50, // Leave space for the NavBar
        left: 0,
        backgroundColor: theme === 'dark' ? '#1c1c1c' : 'white', // Background color based on theme
        width: '100vw', // Full width of the viewport
        height: 'calc(100vh - 50px)', // Subtract NavBar height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'background-color 0.3s ease', // Smooth background transition
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            textAlign: 'center',
            backgroundColor: theme === 'dark' ? '#424242' : 'white', // Dark mode styling
            color: theme === 'dark' ? 'white' : 'black',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: theme === 'dark' ? '#90caf9' : 'inherit', // Adjust color for dark mode
            }}
          >
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              {...register('email', { required: 'required field' })}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ''}
              margin="normal"
              sx={{
                backgroundColor: theme === 'dark' ? '#616161' : 'inherit',
                borderRadius: '4px',
              }}
              InputProps={{
                style: { color: theme === 'dark' ? 'white' : 'black' }, // Input text color
              }}
              InputLabelProps={{
                style: { color: theme === 'dark' ? '#e0e0e0' : 'inherit' }, // Label color
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              {...register('password', { required: 'required field' })}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ''}
              margin="normal"
              sx={{
                backgroundColor: theme === 'dark' ? '#616161' : 'inherit',
                borderRadius: '4px',
              }}
              InputProps={{
                style: { color: theme === 'dark' ? 'white' : 'black' },
              }}
              InputLabelProps={{
                style: { color: theme === 'dark' ? '#e0e0e0' : 'inherit' },
              }}
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              sx={{
                marginTop: 2,
                backgroundColor: theme === 'dark' ? '#90caf9' : '#1976d2', // Button color for dark mode
                color: theme === 'dark' ? '#212121' : 'white',
                '&:hover': {
                  backgroundColor: theme === 'dark' ? '#64b5f6' : '#1565c0',
                },
              }}
            >
              Sign Up
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;
