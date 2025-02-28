import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useLogin } from '../hooks/useLogin.js';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { ThemeContext } from '../context/ThemeContext';

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { login, loading, error } = useLogin();
  const { theme } = useContext(ThemeContext); // Access theme from ThemeContext

  const onSubmit = async (data) => {
    await login(data.email, data.password);
    reset({ email: '', password: '' });
  };

  return (
    <Box
      sx={{
        position: 'fixed', // Ensures the Box spans the entire viewport
        top: 50, // Aligns to the top
        left: 0, // Aligns to the left
        backgroundColor: theme === 'dark' ? '#1c1c1c' : 'white', // Background color
        width: '100vw', // Full width of the viewport
        height: '100vh', // Full height of the viewport
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'background-color 0.3s ease', // Smooth transition
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 2,
            backgroundColor: theme === 'dark' ? '#424242' : 'white', // Dark mode background color
            color: theme === 'dark' ? 'white' : 'black', // Dark mode text color
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              sx={{
                color: theme === 'dark' ? '#90caf9' : 'inherit', // Adjust heading color for dark mode
              }}
            >
              Log In
            </Typography>

            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              margin="normal"
              {...register('email', { required: 'required field' })}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ''}
              autoComplete="off"
              sx={{
                backgroundColor: theme === 'dark' ? '#616161' : 'inherit', // Input background for dark mode
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
              variant="outlined"
              margin="normal"
              {...register('password', { required: 'required field' })}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ''}
              sx={{
                backgroundColor: theme === 'dark' ? '#616161' : 'inherit', // Input background for dark mode
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
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{
                  backgroundColor: theme === 'dark' ? '#90caf9' : '#1976d2', // Button color for dark mode
                  color: theme === 'dark' ? '#212121' : 'white',
                  '&:hover': {
                    backgroundColor: theme === 'dark' ? '#64b5f6' : '#1565c0',
                  },
                }}
              >
                Login
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
