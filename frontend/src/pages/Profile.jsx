import React, { useState, useContext, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Profile = () => {
  const { user } = useAuthContext();
  const { theme } = useContext(ThemeContext);
  const [profileData, setProfileData] = useState(null);
  const [collaboratorCode, setCollaboratorCode] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [collaborators, setCollaborators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          'https://diary-backend-d7dxfjbpe8g0cchj.westus3-01.azurewebsites.net/api/user/profile',
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const json = await response.json();

        if (response.ok) {
          setProfileData(json);
          setCollaborators(json.collaborators || []);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setNotification({
          open: true,
          message: 'Error loading profile data',
          severity: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const handleCopyCode = () => {
    if (profileData?.collaborationCode) {
      navigator.clipboard.writeText(profileData.collaborationCode);
      setNotification({
        open: true,
        message: 'Collaboration code copied to clipboard!',
        severity: 'success',
      });
    }
  };

  const handleAddCollaborator = async () => {
    if (!collaboratorCode.trim()) {
      setNotification({
        open: true,
        message: 'Please enter a collaboration code',
        severity: 'error',
      });
      return;
    }

    try {
      const response = await fetch(
        'https://diary-backend-d7dxfjbpe8g0cchj.westus3-01.azurewebsites.net/api/user/add-collaborator',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ collaborationCode: collaboratorCode.trim() }),
        }
      );

      const json = await response.json();

      if (response.ok) {
        setCollaborators([...collaborators, json.collaborator]);
        setCollaboratorCode('');
        setNotification({
          open: true,
          message: 'Collaborator added successfully!',
          severity: 'success',
        });
      } else {
        setNotification({
          open: true,
          message: json.error || 'Failed to add collaborator',
          severity: 'error',
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: 'Error adding collaborator',
        severity: 'error',
      });
    }
  };

  const getUserInitials = () => {
    if (!user || !user.email) return '?';
    return user.email.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0, // Change from fixed dimensions to cover full viewport
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999, // Ensure it's above everything else
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme === 'dark' ? '#1c1c1c' : '#FFFFFF',
        }}
      >
        <CircularProgress size={80} sx={{ 
          color: theme === 'dark' ? '#93A8AC' : '#0D3B66' 
        }} />
      </Box>
    );
  }

  const cardStyle = {
    backgroundColor: theme === 'dark' ? '#2d2d2d' : '#FFFFFF',
    marginBottom: 3,
    boxShadow: theme === 'dark' 
      ? '0 8px 32px rgba(0, 0, 0, 0.4)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    border: theme === 'dark' ? '1px solid #444' : 'none',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme === 'dark' 
        ? '0 12px 40px rgba(0, 0, 0, 0.5)'
        : '0 12px 40px rgba(0, 0, 0, 0.15)',
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 64, // Updated for new navbar height
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme === 'dark' ? '#1c1c1c' : '#f5f5f5',
        color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
        overflowY: 'auto',
        padding: '2rem',
        transition: 'background-color 0.3s ease',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: theme === 'dark' ? '#2d2d2d' : '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme === 'dark' ? '#93A8AC' : '#0D3B66',
          borderRadius: '4px',
        },
      }}
    >
      <Container maxWidth="md">
        {/* Profile Info Card */}
        <Card sx={cardStyle}>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
                borderBottom: `1px solid ${theme === 'dark' ? 'rgba(147, 168, 172, 0.2)' : 'rgba(13, 59, 102, 0.1)'}`,
                pb: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                  color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}
              >
                {getUserInitials()}
              </Avatar>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  color: theme === 'dark' ? '#FFFFFF' : '#0D3B66'
                }}
              >
                Profile
              </Typography>
            </Box>
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 2 
              }}
            >
              <PersonIcon
                sx={{
                  fontSize: 24,
                  color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                }}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 500,
                  color: theme === 'dark' ? '#FFFFFF' : '#0D3B66'
                }}
              >
                {user?.email}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Collaboration Code Card */}
        <Card sx={cardStyle}>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
                borderBottom: `1px solid ${theme === 'dark' ? 'rgba(147, 168, 172, 0.2)' : 'rgba(13, 59, 102, 0.1)'}`,
                pb: 2,
              }}
            >
              <VpnKeyIcon 
                sx={{ 
                  fontSize: 28,
                  color: theme === 'dark' ? '#93A8AC' : '#0D3B66' 
                }} 
              />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold',
                  color: theme === 'dark' ? '#FFFFFF' : '#0D3B66'
                }}
              >
                Your Collaboration Code
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                mb: 2,
                backgroundColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.1)' : 'rgba(13, 59, 102, 0.05)',
                p: 2,
                borderRadius: 2,
                border: `1px solid ${theme === 'dark' ? 'rgba(147, 168, 172, 0.2)' : 'rgba(13, 59, 102, 0.1)'}`,
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: 'monospace',
                  letterSpacing: 1,
                  fontWeight: 'bold',
                  color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                  flexGrow: 1
                }}
              >
                {profileData?.collaborationCode || 'Loading...'}
              </Typography>
              <Button
                startIcon={<ContentCopyIcon />}
                onClick={handleCopyCode}
                variant="contained"
                sx={{
                  backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                  color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
                  '&:hover': {
                    backgroundColor: theme === 'dark' ? '#FFFFFF' : '#093057',
                  },
                  transition: 'all 0.2s ease',
                  fontWeight: 500,
                  borderRadius: '8px',
                }}
              >
                Copy Code
              </Button>
            </Box>
            <Typography 
              variant="body2"
              sx={{ 
                color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(13, 59, 102, 0.7)',
                fontStyle: 'italic'
              }}
            >
              Share this code with others to let them add you as a collaborator
            </Typography>
          </CardContent>
        </Card>

        {/* Add Collaborator Card */}
        <Card sx={cardStyle}>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
                borderBottom: `1px solid ${theme === 'dark' ? 'rgba(147, 168, 172, 0.2)' : 'rgba(13, 59, 102, 0.1)'}`,
                pb: 2,
              }}
            >
              <PersonAddIcon 
                sx={{ 
                  fontSize: 28,
                  color: theme === 'dark' ? '#93A8AC' : '#0D3B66' 
                }} 
              />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold',
                  color: theme === 'dark' ? '#FFFFFF' : '#0D3B66'
                }}
              >
                Add Collaborator
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                mb: 2,
                flexWrap: { xs: 'wrap', sm: 'nowrap' }
              }}
            >
              <TextField
                value={collaboratorCode}
                onChange={(e) => setCollaboratorCode(e.target.value)}
                label="Enter Collaboration Code"
                variant="outlined"
                fullWidth
                InputProps={{
                  style: {
                    color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                  },
                }}
                InputLabelProps={{
                  style: { color: theme === 'dark' ? '#93A8AC' : '#0D3B66' },
                }}
                sx={{
                  flexGrow: 1,
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
              <Button
                variant="contained"
                onClick={handleAddCollaborator}
                sx={{ 
                  minWidth: '120px',
                  backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                  color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
                  '&:hover': {
                    backgroundColor: theme === 'dark' ? '#FFFFFF' : '#093057',
                  },
                  transition: 'all 0.2s ease',
                  fontWeight: 500,
                  borderRadius: '8px',
                  py: 1.5,
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Add
              </Button>
            </Box>
            <Typography 
              variant="body2"
              sx={{ 
                color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(13, 59, 102, 0.7)',
                fontStyle: 'italic'
              }}
            >
              Enter a friend's collaboration code to add them as a collaborator
            </Typography>
          </CardContent>
        </Card>

        {/* Collaborators List Card */}
        <Card sx={cardStyle}>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
                borderBottom: `1px solid ${theme === 'dark' ? 'rgba(147, 168, 172, 0.2)' : 'rgba(13, 59, 102, 0.1)'}`,
                pb: 2,
              }}
            >
              <GroupIcon 
                sx={{ 
                  fontSize: 28,
                  color: theme === 'dark' ? '#93A8AC' : '#0D3B66' 
                }} 
              />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold',
                  color: theme === 'dark' ? '#FFFFFF' : '#0D3B66'
                }}
              >
                Your Collaborators
              </Typography>
            </Box>
            {collaborators.length > 0 ? (
              <List sx={{ p: 0 }}>
                {collaborators.map((collaborator, index) => (
                  <React.Fragment key={collaborator._id || index}>
                    <ListItem sx={{ px: 0 }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: theme === 'dark' ? 'rgba(147, 168, 172, 0.2)' : 'rgba(13, 59, 102, 0.1)',
                          color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                          fontSize: '0.9rem',
                          mr: 2
                        }}
                      >
                        {collaborator.email.charAt(0).toUpperCase()}
                      </Avatar>
                      <ListItemText
                        primary={collaborator.email}
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                            fontWeight: 500
                          },
                        }}
                      />
                    </ListItem>
                    {index < collaborators.length - 1 && (
                      <Divider 
                        sx={{ 
                          borderColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.2)' : 'rgba(13, 59, 102, 0.1)'
                        }} 
                      />
                    )}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box 
                sx={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.1)' : 'rgba(13, 59, 102, 0.05)',
                  p: 3,
                  borderRadius: 2,
                  textAlign: 'center',
                  border: `1px dashed ${theme === 'dark' ? 'rgba(147, 168, 172, 0.2)' : 'rgba(13, 59, 102, 0.1)'}`,
                }}
              >
                <Typography 
                  sx={{ 
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(13, 59, 102, 0.7)',
                    fontStyle: 'italic'
                  }}
                >
                  No collaborators yet. Add them using their collaboration codes.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            backgroundColor: 
              notification.severity === 'success' 
                ? (theme === 'dark' ? '#93A8AC' : '#0D3B66')
                : notification.severity === 'error'
                ? '#d32f2f'
                : notification.severity === 'warning'
                ? '#ed6c02'
                : '#0288d1',
            color: 
              notification.severity === 'success' && theme === 'dark'
                ? '#0D3B66'
                : '#fff',
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;