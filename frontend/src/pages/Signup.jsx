import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSignup } from '../hooks/useSignup.js';
import {
  Container,
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { ThemeContext } from '../context/ThemeContext';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const Signup = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const { signup, loading, error } = useSignup();
  const { theme } = useContext(ThemeContext);
  
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });
  
  const password = watch('password', '');
  
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordChecks({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
      });
      return;
    }
    
    // Define criteria for password strength
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    setPasswordChecks(checks);
    
    // Calculate strength
    const strengthScore = Object.values(checks).filter(Boolean).length;
    setPasswordStrength((strengthScore / 5) * 100);
  }, [password]);
  
  // Function to determine password strength color
  const getStrengthColor = () => {
    if (passwordStrength < 40) return theme === 'dark' ? '#e57373' : '#d32f2f'; // Weak (red)
    if (passwordStrength < 70) return theme === 'dark' ? '#ffb74d' : '#ed6c02'; // Medium (orange)
    return theme === 'dark' ? '#81c784' : '#2e7d32'; // Strong (green)
  };
  
  // Function to get password strength label
  const getStrengthLabel = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  };

  const onSubmit = async (data) => {
    await signup(data.email, data.password);
    reset({ email: '', password: '' });
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 64, // Updated to match navbar height
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
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
              fontWeight: 'bold',
              mb: 3,
              textAlign: 'center',
            }}
          >
            Sign Up
          </Typography>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
              <EmailIcon sx={{ 
                color: theme === 'dark' ? '#93A8AC' : '#0D3B66', 
                mr: 1, mb: 0.5 
              }} />
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Enter a valid email address'
                  }
                })}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
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
            
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
              <LockIcon sx={{ 
                color: theme === 'dark' ? '#93A8AC' : '#0D3B66', 
                mr: 1, mb: 0.5 
              }} />
              <TextField
                fullWidth
                label="Password"
                type="password"
                {...register('password', { 
                  required: 'Password is required',
                  validate: value => passwordStrength >= 60 || 'Password is not strong enough'
                })}
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
            
            {/* Password strength meter */}
            {password && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: theme === 'dark' ? '#93A8AC' : '#0D3B66' }}>
                    Password Strength:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: getStrengthColor(),
                      fontWeight: 'bold' 
                    }}
                  >
                    {getStrengthLabel()}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getStrengthColor(),
                      borderRadius: 5,
                    }
                  }}
                />
                
                {/* Password requirements */}
                <List dense sx={{ mt: 1 }}>
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      {passwordChecks.length ? (
                        <CheckCircleIcon fontSize="small" sx={{ color: theme === 'dark' ? '#81c784' : '#2e7d32' }} />
                      ) : (
                        <CancelIcon fontSize="small" sx={{ color: theme === 'dark' ? '#e57373' : '#d32f2f' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary="At least 8 characters"
                      primaryTypographyProps={{ 
                        fontSize: 12,
                        color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                      }}
                    />
                  </ListItem>
                  
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      {passwordChecks.lowercase ? (
                        <CheckCircleIcon fontSize="small" sx={{ color: theme === 'dark' ? '#81c784' : '#2e7d32' }} />
                      ) : (
                        <CancelIcon fontSize="small" sx={{ color: theme === 'dark' ? '#e57373' : '#d32f2f' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary="At least one lowercase letter"
                      primaryTypographyProps={{ 
                        fontSize: 12,
                        color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                      }}
                    />
                  </ListItem>
                  
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      {passwordChecks.uppercase ? (
                        <CheckCircleIcon fontSize="small" sx={{ color: theme === 'dark' ? '#81c784' : '#2e7d32' }} />
                      ) : (
                        <CancelIcon fontSize="small" sx={{ color: theme === 'dark' ? '#e57373' : '#d32f2f' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary="At least one uppercase letter"
                      primaryTypographyProps={{ 
                        fontSize: 12,
                        color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                      }}
                    />
                  </ListItem>
                  
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      {passwordChecks.number ? (
                        <CheckCircleIcon fontSize="small" sx={{ color: theme === 'dark' ? '#81c784' : '#2e7d32' }} />
                      ) : (
                        <CancelIcon fontSize="small" sx={{ color: theme === 'dark' ? '#e57373' : '#d32f2f' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary="At least one number"
                      primaryTypographyProps={{ 
                        fontSize: 12,
                        color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                      }}
                    />
                  </ListItem>
                  
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      {passwordChecks.special ? (
                        <CheckCircleIcon fontSize="small" sx={{ color: theme === 'dark' ? '#81c784' : '#2e7d32' }} />
                      ) : (
                        <CancelIcon fontSize="small" sx={{ color: theme === 'dark' ? '#e57373' : '#d32f2f' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary="At least one special character"
                      primaryTypographyProps={{ 
                        fontSize: 12,
                        color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                      }}
                    />
                  </ListItem>
                </List>
              </Box>
            )}
            
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
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading || passwordStrength < 60}
              startIcon={<HowToRegIcon />}
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
              Sign Up
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;