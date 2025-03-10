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
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { login, loading, error } = useLogin();
  const { theme } = useContext(ThemeContext);

  const onSubmit = async (data) => {
    await login(data.email, data.password);
    reset({ email: '', password: '' });
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 64, // Updated for new navbar height
        left: 0,
        backgroundColor: theme === 'dark' ? '#1c1c1c' : '#FFFFFF',
        width: '100vw',
        height: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={theme === 'dark' ? 4 : 2}
          sx={{
            padding: 4,
            borderRadius: 3,
            backgroundColor: theme === 'dark' ? '#2d2d2d' : '#FFFFFF',
            color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
            boxShadow: theme === 'dark' 
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: theme === 'dark' ? '1px solid #444' : 'none',
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              sx={{
                color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                fontWeight: 'bold',
                mb: 3,
                textAlign: 'center',
              }}
            >
              Log In
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
              <EmailIcon sx={{ 
                color: theme === 'dark' ? '#93A8AC' : '#0D3B66', 
                mr: 1, mb: 0.5 
              }} />
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                {...register('email', { required: 'Email is required' })}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
                autoComplete="off"
                InputProps={{
                  style: { color: theme === 'dark' ? '#FFFFFF' : '#0D3B66' },
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
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
              <LockIcon sx={{ 
                color: theme === 'dark' ? '#93A8AC' : '#0D3B66', 
                mr: 1, mb: 0.5 
              }} />
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                {...register('password', { required: 'Password is required' })}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
                InputProps={{
                  style: { color: theme === 'dark' ? '#FFFFFF' : '#0D3B66' },
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
            </Box>

            {error && (
              <Typography 
                sx={{ 
                  color: theme === 'dark' ? '#e57373' : '#d32f2f',
                  mt: 1,
                  mb: 2,
                  textAlign: 'center',
                  fontWeight: 500,
                  backgroundColor: theme === 'dark' ? 'rgba(229, 115, 115, 0.1)' : 'rgba(211, 47, 47, 0.05)',
                  padding: '8px',
                  borderRadius: '4px',
                }}
              >
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={<LoginIcon />}
              sx={{
                mt: 2,
                mb: 2,
                backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
                padding: '12px',
                fontWeight: 'bold',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: theme === 'dark' ? '#FFFFFF' : '#093057',
                  boxShadow: theme === 'dark' 
                    ? '0 4px 12px rgba(147, 168, 172, 0.5)' 
                    : '0 4px 12px rgba(13, 59, 102, 0.3)',
                },
                '&.Mui-disabled': {
                  backgroundColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.3)' : 'rgba(13, 59, 102, 0.3)',
                  color: theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.7)',
                }
              }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;