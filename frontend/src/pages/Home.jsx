import { useEffect, useContext } from 'react';
import { usePostsContext } from '../hooks/usePostsContext.js';
import { useAuthContext } from '../hooks/useAuthContext.js';
import PostHead from '../components/PostHead';
import PostForm from '../components/PostForm';
import SearchBar from '../components/SearchBar';
import {
  Grid,
  Box,
  Typography,
  CircularProgress,
  Container,
  Chip,
  Button,
  Paper,
} from '@mui/material';
import { ThemeContext } from '../context/ThemeContext';
import { useState } from 'react';

const Home = () => {
  const { posts, dispatch } = usePostsContext();
  const { user } = useAuthContext();
  const { theme } = useContext(ThemeContext);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTagFilterActive, setIsTagFilterActive] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('http://localhost:4000/api/posts', {
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

  const getFilteredPosts = () => {
    const basePostsList = searchResults || posts;
    
    if (!isTagFilterActive) return basePostsList;
    
    return basePostsList?.filter((post) => {
      if (!post.tags) return false;
      return selectedTags.some((tag) => post.tags.includes(tag));
    });
  };

  const filteredPosts = getFilteredPosts();

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

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
          backgroundColor: theme === 'dark' ? '#1c1c1c' : '#FFFFFF',
        }}
      >
        <CircularProgress size={100} sx={{ 
          color: theme === 'dark' ? '#93A8AC' : '#0D3B66' 
        }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 64, // Updated for new navbar height
        left: 0,
        backgroundColor: theme === 'dark' ? '#1c1c1c' : '#FFFFFF',
        width: '100vw',
        height: 'calc(100vh - 64px)', // Full height minus navbar
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start', // Align to top instead of center
        transition: 'background-color 0.3s ease',
        overflow: 'hidden', // Prevent outer scroll
      }}
    >
      <Container maxWidth="xl" sx={{ height: '100%', pt: 3, pb: 3 }}>
        <Grid container spacing={4} sx={{ height: '100%' }}>
          {/* Posts Column */}
          <Grid item xs={12} md={8} sx={{ height: '100%' }}>
            {/* Scrollable container for posts */}
            <Box sx={{ 
              height: '100%',
              overflowY: 'auto',
              paddingRight: 2,
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
            }}>
              <Typography
                variant="h4"
                sx={{
                  color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                  mb: 3,
                  fontWeight: 'bold',
                }}
              >
                Posts
              </Typography>
              
              <SearchBar onSearchResults={handleSearchResults} />
  
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
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: isTagFilterActive
                      ? (theme === 'dark' ? '#93A8AC' : '#0D3B66')
                      : 'transparent',
                    color: isTagFilterActive 
                      ? (theme === 'dark' ? '#0D3B66' : '#FFFFFF') 
                      : (theme === 'dark' ? '#FFFFFF' : '#0D3B66'),
                    borderColor: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                    '&:hover': {
                      backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                      color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
                      borderColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                    },
                    borderRadius: '4px',
                    transition: 'all 0.2s ease',
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
                      sx={{
                        backgroundColor: selectedTags.includes(tag) 
                          ? (theme === 'dark' ? '#93A8AC' : '#0D3B66') 
                          : (theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(13,59,102,0.1)'),
                        color: selectedTags.includes(tag) 
                          ? (theme === 'dark' ? '#0D3B66' : '#FFFFFF') 
                          : (theme === 'dark' ? '#FFFFFF' : '#0D3B66'),
                        '&:hover': {
                          backgroundColor: theme === 'dark' ? 'rgba(147,168,172,0.8)' : 'rgba(13,59,102,0.8)',
                          color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    />
                  ))}
                </Box>
              </Box>
  
              {searchResults && (
                <Box
                  sx={{
                    mb: 2,
                    p: 1,
                    backgroundColor: theme === 'dark' ? 'rgba(147,168,172,0.2)' : 'rgba(13,59,102,0.1)',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: `1px solid ${theme === 'dark' ? 'rgba(147,168,172,0.3)' : 'rgba(13,59,102,0.2)'}`,
                  }}
                >
                  <Typography variant="body2" sx={{ 
                    color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                    fontWeight: 'medium',
                  }}>
                    Found {filteredPosts?.length} result{filteredPosts?.length !== 1 ? 's' : ''}
                  </Typography>
                  <Button 
                    size="small" 
                    onClick={() => setSearchResults(null)}
                    variant="text"
                    sx={{
                      color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                      '&:hover': {
                        backgroundColor: theme === 'dark' ? 'rgba(147,168,172,0.2)' : 'rgba(13,59,102,0.1)',
                      },
                    }}
                  >
                    Clear Search
                  </Button>
                </Box>
              )}
  
              {filteredPosts?.length === 0 && (
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: theme === 'dark' ? '#2d2d2d' : '#FFFFFF',
                    color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                    border: `1px solid ${theme === 'dark' ? 'rgba(147,168,172,0.3)' : 'rgba(13,59,102,0.2)'}`,
                    borderRadius: '8px',
                  }}
                >
                  <Typography variant="h6">No posts found</Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    Try adjusting your search or filter criteria
                  </Typography>
                </Paper>
              )}
  
              <Grid container spacing={2}>
                {filteredPosts?.map((post) => (
                  <Grid item xs={12} sm={6} key={post._id}>
                    <PostHead post={post} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Create Post Column */}
          <Grid item xs={12} md={4} sx={{ height: '100%' }}>
            {/* Scrollable container for create post form */}
            <Box sx={{ 
              height: '100%',
              overflowY: 'auto',
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
            }}>
              <Typography
                variant="h4"
                sx={{
                  color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                  mb: 3,
                  marginLeft: '25px',
                  fontWeight: 'bold',
                }}
              >
                Create a Post
              </Typography>
              <PostForm />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;