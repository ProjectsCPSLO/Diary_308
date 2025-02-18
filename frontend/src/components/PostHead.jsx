import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { usePostsContext } from '../hooks/usePostsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { ThemeContext } from '../context/ThemeContext';
import MoodIcon from '@mui/icons-material/Mood';
import {
   ListItem,
   Typography,
   IconButton,
   Stack,
   Box,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Button,
   List,
   ListItemText,
   Checkbox,
   Snackbar,
   Alert,
   Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import EditPostForm from './EditPostForm';

const PostHead = ({ post }) => {
   const { dispatch } = usePostsContext();
   const { user } = useAuthContext();
   const { theme } = useContext(ThemeContext);
   const [editDialogOpen, setEditDialogOpen] = useState(false);
   const [shareDialogOpen, setShareDialogOpen] = useState(false);
   const [collaborators, setCollaborators] = useState([]);
   const [selectedCollaborators, setSelectedCollaborators] = useState([]);
   const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
   const [sharedWith, setSharedWith] = useState(post.sharedWith || []);

   useEffect(() => {
       const fetchCollaborators = async () => {
           try {
               const response = await fetch('http://localhost:4000/api/user/collaborators', {
                   headers: {
                       'Authorization': `Bearer ${user.token}`
                   }
               });
               const json = await response.json();
               if (response.ok) {
                   setCollaborators(json);
               }
           } catch (error) {
               console.error('Error fetching collaborators:', error);
           }
       };

       fetchCollaborators();
   }, [user]);

   const handleClick = async () => {
       const response = await fetch(
           `http://localhost:4000/api/posts/${post._id}`,
           {
               method: 'DELETE',
               headers: {
                   Authorization: `Bearer ${user.token}`,
               },
           }
       );

       if (response.ok) {
           const json = await response.json();
           dispatch({ type: 'DELETE_POST', payload: post._id });
           console.log('Post deleted:', post._id);
       } else {
           console.error('Failed to delete post:', response.statusText);
       }
   };

   const handleShare = async () => {
    try {
        // Only send collaborators that aren't already shared with
        const newCollaborators = selectedCollaborators.filter(
            id => !sharedWith.includes(id)
        );

        if (newCollaborators.length === 0) {
            setShareDialogOpen(false);
            return;
        }

        const response = await fetch(`http://localhost:4000/api/posts/${post._id}/share`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                collaboratorIds: newCollaborators
            })
        });

        if (response.ok) {
            const data = await response.json();
            setSharedWith(data.sharedWith);
            setShareDialogOpen(false);
            setSelectedCollaborators([]);
        }
    } catch (error) {
        console.error('Error sharing post:', error);
    }
};

   const postStyle = {
       backgroundColor: theme === 'dark' ? '#424242' : '#fff',
       color: theme === 'dark' ? '#fff' : '#000',
       padding: '1.5rem',
       borderRadius: '8px',
       boxShadow: theme === 'dark' ? '0px 4px 6px rgba(0,0,0,0.5)' : '0px 2px 4px rgba(0,0,0,0.1)',
       border: theme === 'dark' ? '1px solid #616161' : '1px solid #e0e0e0',
       transition: 'background-color 0.3s ease, color 0.3s ease',
       display: 'flex',
       flexDirection: 'column',
       height: '100%',
       minHeight: '200px'
   };

   const titleStyle = {
    color: theme === 'dark' ? '#bbdefb' : '#1565c0',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    '&:hover': {
        color: theme === 'dark' ? '#90caf9' : '#1a73e8',
        },
    };

   const dateStyle = {
    color: theme === 'dark' ? '#e0e0e0' : '#757575',
    fontSize: '0.875rem',
    marginBottom: '1rem',
};

const contentStyle = {
    color: theme === 'dark' ? '#f5f5f5' : '#212121',
    fontSize: '1rem',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    flex: 1
};

const moodStyle = {
    color: theme === 'dark' ? '#e0e0e0' : '#757575',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
};

const handleEditClick = (e) => {
    e.stopPropagation();
    setEditDialogOpen(true);
};

return (
    <>
        <ListItem sx={postStyle}>
            <Stack
                direction="column"
                spacing={1}
                sx={{ height: '100%' }}
            >
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography
                        component={Link}
                        to={`/api/posts/${post._id}`}
                        sx={titleStyle}
                    >
                        {post.title}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            onClick={() => setShareDialogOpen(true)}
                            sx={{
                                color: theme === 'dark' ? '#90caf9' : '#1976d2',
                                '&:hover': {
                                    backgroundColor: theme === 'dark'
                                        ? 'rgba(144, 202, 249, 0.2)'
                                        : 'rgba(25, 118, 210, 0.1)',
                                },
                            }}
                        >
                            <ShareIcon />
                        </IconButton>

                        <IconButton
                            onClick={handleEditClick}
                            sx={{
                                color: theme === 'dark' ? '#90caf9' : '#1976d2',
                                '&:hover': {
                                    backgroundColor: theme === 'dark'
                                        ? 'rgba(144, 202, 249, 0.2)'
                                        : 'rgba(25, 118, 210, 0.1)',
                                },
                            }}
                        >
                            <EditIcon />
                        </IconButton>

                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClick();
                            }}
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
                    </Box>
                </Stack>

                <Typography variant="body2" sx={dateStyle}>
                    {format(new Date(post.date), 'MMMM d, y')}
                </Typography>

                <Box sx={moodStyle}>
                    <MoodIcon />
                    <span>{post.mood}</span>
                </Box>

                <Typography
                    variant="body1"
                    sx={contentStyle}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </Stack>
        </ListItem>
        
        <EditPostForm 
            post={post}
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            theme={theme}
        />

        {/* Share Dialog */}
        <Dialog
    open={shareDialogOpen}
    onClose={() => {
        setShareDialogOpen(false);
        setSelectedCollaborators([]);
    }}
    PaperProps={{
        sx: {
            backgroundColor: theme === 'dark' ? '#424242' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
        }
    }}
>
    <DialogTitle>Share with Collaborators</DialogTitle>
    <DialogContent>
        {collaborators.length > 0 ? (
            <List>
                {collaborators.map((collaborator) => (
                    <ListItem key={collaborator._id}>
                        <Checkbox
                            checked={selectedCollaborators.includes(collaborator._id) || 
                                   sharedWith.includes(collaborator._id)}
                            disabled={sharedWith.includes(collaborator._id)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedCollaborators([...selectedCollaborators, collaborator._id]);
                                } else {
                                    setSelectedCollaborators(
                                        selectedCollaborators.filter(id => id !== collaborator._id)
                                    );
                                }
                            }}
                            sx={{
                                color: theme === 'dark' ? '#90caf9' : '#1976d2',
                                '&.Mui-checked': {
                                    color: theme === 'dark' ? '#90caf9' : '#1976d2',
                                },
                                '&.Mui-disabled': {
                                    color: theme === 'dark' ? '#666' : '#bbb',
                                },
                            }}
                        />
                        <ListItemText 
                            primary={collaborator.email}
                            secondary={sharedWith.includes(collaborator._id) ? '(Already shared)' : ''}
                            sx={{
                                '& .MuiListItemText-secondary': {
                                    color: theme === 'dark' ? '#aaa' : '#666',
                                }
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        ) : (
            <Typography>No collaborators yet. Add them in your profile.</Typography>
        )}
    </DialogContent>
    <DialogActions>
        <Button 
            onClick={() => {
                setShareDialogOpen(false);
                setSelectedCollaborators([]);
            }}
        >
            Cancel
        </Button>
        <Button 
            onClick={handleShare} 
            variant="contained" 
            color="primary"
            disabled={selectedCollaborators.length === 0 || 
                     selectedCollaborators.every(id => sharedWith.includes(id))}
        >
            Share
        </Button>
    </DialogActions>
</Dialog>

        {/* Notification Snackbar */}
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
    </>
);
                   <Typography
                       variant="body1"
                       sx={contentStyle}
                       dangerouslySetInnerHTML={{ __html: post.content }}
                   />
                   {post.tags && post.tags.length > 0 && (
                        <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 0.5, 
                            mt: 1 
                        }}>
                            {post.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{
                                        backgroundColor: theme === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.08)',
                                    }}
                                />
                            ))}
                        </Box>
                    )}
               </Stack>
           </ListItem>
           
           <EditPostForm 
               post={post}
               open={editDialogOpen}
               onClose={() => setEditDialogOpen(false)}
               theme={theme}
           />
       </>
   );
};

export default PostHead;