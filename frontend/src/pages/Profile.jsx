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
  IconButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';

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
        const response = await fetch('https://diary-backend-d7dxfjbpe8g0cchj.westus3-01.azurewebsites.net/api/user/profile', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
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

  const handleRemoveCollaborator = async (collaboratorId) => {
    try {
      console.log('Removing collaborator with ID:', collaboratorId);
      
      const response = await fetch(
        'https://diary-backend-d7dxfjbpe8g0cchj.westus3-01.azurewebsites.net/api/user/remove-collaborator',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ collaboratorId }),
        }
      );
  
      const json = await response.json();
      console.log('Response from server:', json);
  
      if (response.ok) {
        // Update the collaborators list in state
        setCollaborators(collaborators.filter(c => c._id !== collaboratorId));
        setNotification({
          open: true,
          message: 'Collaborator removed successfully!',
          severity: 'success',
        });
      } else {
        console.error('Error from server:', json.error);
        setNotification({
          open: true,
          message: json.error || 'Failed to remove collaborator',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error removing collaborator:', error);
      setNotification({
        open: true,
        message: `Error removing collaborator: ${error.message}`,
        severity: 'error',
      });
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 56,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme === 'dark' ? '#1c1c1c' : '#f5f5f5',
        color: theme === 'dark' ? 'white' : 'black',
        overflowY: 'auto',
        padding: '2rem',
      }}
    >
      <Container maxWidth="md">
        {/* Profile Info Card */}
        <Card
          sx={{
            backgroundColor: theme === 'dark' ? '#424242' : 'white',
            marginBottom: 3,
            boxShadow:
              theme === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.4)' : undefined,
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                marginBottom: 2,
              }}
            >
              <PersonIcon
                sx={{
                  fontSize: 40,
                  color: theme === 'dark' ? '#90caf9' : '#1976d2',
                }}
              />
              <Typography variant="h4" gutterBottom>
                Profile
              </Typography>
            </Box>
            <Typography variant="h6" gutterBottom>
              Email: {user?.email}
            </Typography>
          </CardContent>
        </Card>

        {/* Collaboration Code Card */}
        <Card
          sx={{
            backgroundColor: theme === 'dark' ? '#424242' : 'white',
            marginBottom: 3,
            boxShadow:
              theme === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.4)' : undefined,
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Collaboration Code
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                marginBottom: 2,
              }}
            >
              <Typography variant="h5" sx={{ fontFamily: 'monospace' }}>
                {profileData?.collaborationCode || 'Loading...'}
              </Typography>
              <Button
                startIcon={<ContentCopyIcon />}
                onClick={handleCopyCode}
                variant="contained"
                color="primary"
              >
                Copy Code
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Add Collaborator Card */}
        <Card
          sx={{
            backgroundColor: theme === 'dark' ? '#424242' : 'white',
            marginBottom: 3,
            boxShadow:
              theme === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.4)' : undefined,
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add Collaborator
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                marginBottom: 2,
              }}
            >
              <TextField
                value={collaboratorCode}
                onChange={(e) => setCollaboratorCode(e.target.value)}
                label="Enter Collaboration Code"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  backgroundColor: theme === 'dark' ? '#616161' : 'white',
                  '& .MuiInputBase-input': {
                    color: theme === 'dark' ? 'white' : 'black',
                  },
                  '& .MuiInputLabel-root': {
                    color: theme === 'dark' ? '#e0e0e0' : 'inherit',
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddCollaborator}
                sx={{ minWidth: '120px' }}
              >
                Add
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Collaborators List Card */}
        <Card
          sx={{
            backgroundColor: theme === 'dark' ? '#424242' : 'white',
            boxShadow:
              theme === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.4)' : undefined,
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Collaborators
            </Typography>
            <List>
              {collaborators.length > 0 ? (
                collaborators.map((collaborator, index) => (
                  <React.Fragment key={collaborator._id || index}>
                    <ListItem
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => handleRemoveCollaborator(collaborator._id)}
                          sx={{
                            color: theme === 'dark' ? '#e57373' : '#d32f2f',
                            '&:hover': {
                              backgroundColor: theme === 'dark' 
                                ? 'rgba(229, 115, 115, 0.2)' 
                                : 'rgba(211, 47, 47, 0.1)',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={collaborator.email}
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: theme === 'dark' ? 'white' : 'black',
                          },
                        }}
                      />
                    </ListItem>
                    {index < collaborators.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <Typography color="text.secondary">
                  No collaborators yet
                </Typography>
              )}
            </List>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;