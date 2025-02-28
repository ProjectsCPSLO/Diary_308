import { useEffect, useContext } from 'react';
import { usePostsContext } from '../hooks/usePostsContext.js';
import { useAuthContext } from '../hooks/useAuthContext.js';
import PostHead from '../components/PostHead';
import PostForm from '../components/PostForm';
import {
  Grid,
  Box,
  Typography,
  CircularProgress,
  Container,
  Chip,
  Button,
} from '@mui/material';
import { ThemeContext } from '../context/ThemeContext';
import { useState } from 'react';

const Home = () => {
  const { posts, dispatch } = usePostsContext();
  const { user } = useAuthContext();
  const { theme } = useContext(ThemeContext);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTagFilterActive, setIsTagFilterActive] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('https://diary-backend-d7dxfjbpe8g0cchj.westus3-01.azurewebsites.net/api/posts', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) dispatch({ type: 'SET_POSTS', payload: json });
    };

    if (user) fetchPosts();
  }, [user, dispatch]);

  const allTags = Array.from(
    new Set(posts?.flatMap((post) => post.tags || []) || [])
  );

  const handleTagClick = (tag) => {
    setSelectedTags((prev) => {
      const isTagSelected = prev.includes(tag);
      if (isTagSelected) {
        const newTags = prev.filter((t) => t !== tag);

        if (newTags.length === 0) {
          setIsTagFilterActive(false);
        }
        return newTags;
      } else {
        setIsTagFilterActive(true);
        return [...prev, tag];
      }
    });
  };

  const toggleFilter = () => {
    setIsTagFilterActive(!isTagFilterActive);

    if (isTagFilterActive) {
      setSelectedTags([]);
    }
  };

  const filteredPosts = posts?.filter((post) => {
    if (!isTagFilterActive) return true;
    if (!post.tags) return false;
    return selectedTags.some((tag) => post.tags.includes(tag));
  });

  if (!posts) {
    return (
      <Box
        sx={{
          width: '200px',
          height: '200px',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme === 'dark' ? '#1c1c1c' : '#fff',
        }}
      >
        <CircularProgress size={100} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 50,
        left: 0,
        backgroundColor: theme === 'dark' ? '#1c1c1c' : 'white',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography
              variant="h4"
              sx={{
                color: theme === 'dark' ? '#90caf9' : '#000',
                mb: 3,
              }}
            >
              Posts
            </Typography>

            <Box
              sx={{
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Button
                onClick={toggleFilter}
                variant="outlined"
                sx={{
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: isTagFilterActive
                    ? '#1976d2'
                    : 'transparent',
                  color: isTagFilterActive ? 'white' : '#1976d2',
                  '&:hover': {
                    backgroundColor: isTagFilterActive
                      ? '#1565c0'
                      : 'rgba(25, 118, 210, 0.04)',
                  },
                }}
              >
                <span style={{ fontSize: '0.875rem' }}>
                  {isTagFilterActive ? 'Filters On' : 'Filters Off'}
                </span>
              </Button>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  opacity: isTagFilterActive ? 1 : 0.7,
                  transition: 'opacity 0.3s ease',
                }}
              >
                {allTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => handleTagClick(tag)}
                    color={selectedTags.includes(tag) ? 'primary' : 'default'}
                  />
                ))}
              </Box>
            </Box>

            <Grid container spacing={2}>
              {filteredPosts.map((post) => (
                <Grid item xs={12} sm={6} key={post._id}>
                  <PostHead post={post} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography
              variant="h4"
              sx={{
                color: theme === 'dark' ? '#90caf9' : '#000',
                mb: 3,
                marginLeft: '25px',
              }}
            >
              Create a Post
            </Typography>
            <PostForm />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
