import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Box, Typography, Card, CardContent, Paper, TextField, Button } from '@mui/material';

const DiaryPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [password, setPassword] = useState('');
    const [passwordRequired, setPasswordRequired] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuthContext();
    const { theme } = useContext(ThemeContext);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPost = async (passwordAttempt = null) => {
        setIsLoading(true);
        console.log('Fetching post:', id);
        console.log('Attempting with password:', passwordAttempt);

        try {
            // Construct URL with password if provided
            const url = new URL(`https://diary-backend-utp0.onrender.com/api/posts/${id}`);
            if (passwordAttempt) {
                url.searchParams.append('password', passwordAttempt);
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            const json = await response.json();
            console.log('API Response:', json);

            if (!response.ok) {
                if (json.isPasswordProtected) {
                    console.log('Post is password protected');
                    setPasswordRequired(true);
                    if (passwordAttempt) {
                        setError('Incorrect password');
                    }
                } else {
                    setError(json.error);
                }
                setPost(null);
            } else {
                console.log('Post fetched successfully');
                setPost(json);
                setPasswordRequired(false);
                setError(null);
            }
        } catch (err) {
            console.error('Error fetching post:', err);
            setError('Failed to load post');
        } finally {
            setIsLoading(false);
        }
    };

    // Only fetch on initial load
    useEffect(() => {
        if (user && id) {
            fetchPost();
        }
    }, [id, user]); // Don't include fetchPost in dependencies

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting password:', password);
        await fetchPost(password);
        setPassword(''); // Clear password field after attempt
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 50,
                left: 0,
                right: 0,
                bottom: 0,
                minHeight: '100vh',
                backgroundColor: theme === 'dark' ? '#1c1c1c' : 'white',
                color: theme === 'dark' ? 'white' : 'black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
                transition: 'background-color 0.3s ease',
            }}
        >
            {passwordRequired ? (
                <Paper
                    elevation={3}
                    sx={{
                        padding: '2rem',
                        maxWidth: '400px',
                        textAlign: 'center',
                        backgroundColor: theme === 'dark' ? '#424242' : 'white',
                        color: theme === 'dark' ? 'white' : 'black',
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        This post is password-protected.
                    </Typography>
                    <form onSubmit={handlePasswordSubmit}>
                        <TextField
                            label="Enter Password"
                            type="password"
                            fullWidth
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!error}
                            helperText={error}
                            sx={{
                                marginBottom: '1rem',
                                backgroundColor: theme === 'dark' ? '#616161' : 'inherit',
                                '& .MuiInputBase-input': {
                                    color: theme === 'dark' ? '#fff' : 'inherit',
                                },
                                '& .MuiInputLabel-root': {
                                    color: theme === 'dark' ? '#fff' : 'inherit',
                                },
                            }}
                        />
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            fullWidth
                        >
                            Submit
                        </Button>
                    </form>
                </Paper>
            ) : (
                <Card
                    sx={{
                        maxWidth: '800px',
                        padding: '2rem',
                        borderRadius: '8px',
                        backgroundColor: theme === 'dark' ? '#424242' : '#f5f5f5',
                        color: theme === 'dark' ? '#fff' : '#000',
                        boxShadow: theme === 'dark' ? '0px 4px 6px rgba(0, 0, 0, 0.5)' : '0px 2px 4px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {post.title}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {new Date(post.date).toLocaleString()}
                        </Typography>
                        <Typography
                            variant="body1"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default DiaryPost;