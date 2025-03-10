import React, { useState, useContext, useCallback } from 'react';
import { usePostsContext } from '../hooks/usePostsContext';
import { ThemeContext } from '../context/ThemeContext';
import { 
  Box, 
  TextField, 
  InputAdornment, 
  IconButton,
  Menu,
  MenuItem,
  Button,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

const SearchBar = ({ onSearchResults }) => {
  const { posts } = usePostsContext();
  const { theme } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleSearch = useCallback(() => {
    if (!posts || searchTerm.trim() === '') {
      onSearchResults(null); 
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    let results;

    switch(searchType) {
      case 'title':
        results = posts.filter(post => 
          post.title.toLowerCase().includes(term)
        );
        break;
      case 'content':
        results = posts.filter(post => 
          post.content.toLowerCase().includes(term)
        );
        break;
      case 'tags':
        results = posts.filter(post => 
          post.tags && post.tags.some(tag => 
            tag.toLowerCase().includes(term)
          )
        );
        break;
      case 'date':
        results = posts.filter(post => {
          const postDate = new Date(post.date).toLocaleDateString();
          return postDate.includes(term);
        });
        break;
      case 'all':
      default:
        results = posts.filter(post => 
          post.title.toLowerCase().includes(term) || 
          post.content.toLowerCase().includes(term) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(term))) ||
          new Date(post.date).toLocaleDateString().includes(term)
        );
        break;
    }

    onSearchResults(results);
  }, [posts, searchTerm, searchType, onSearchResults]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() !== '') {
      setTimeout(() => {
        if (value === e.target.value) {
          onSearchResults(
            posts?.filter(post => {
              const term = value.toLowerCase().trim();
              switch(searchType) {
                case 'title':
                  return post.title.toLowerCase().includes(term);
                case 'content':
                  return post.content.toLowerCase().includes(term);
                case 'tags':
                  return post.tags && post.tags.some(tag => tag.toLowerCase().includes(term));
                case 'date':
                  return new Date(post.date).toLocaleDateString().includes(term);
                case 'all':
                default:
                  return post.title.toLowerCase().includes(term) || 
                         post.content.toLowerCase().includes(term) ||
                         (post.tags && post.tags.some(tag => tag.toLowerCase().includes(term))) ||
                         new Date(post.date).toLocaleDateString().includes(term);
              }
            })
          );
        }
      }, 500);
    } else {
      onSearchResults(null);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    handleMenuClose();
    
    if (searchTerm.trim() !== '') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearchResults(null);
  };

  return (
    <Box sx={{ mb: 3, width: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        width: '100%'
      }}>
        <TextField
          fullWidth
          placeholder="Search posts..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme === 'dark' ? '#93A8AC' : '#0D3B66' }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={clearSearch}>
                  <CloseIcon fontSize="small" sx={{ color: theme === 'dark' ? '#93A8AC' : '#0D3B66' }} />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              backgroundColor: theme === 'dark' ? '#3a3a3a' : '#f5f5f5',
              color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
              '&:hover': {
                backgroundColor: theme === 'dark' ? '#4a4a4a' : '#e5e5e5',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.3)' : 'rgba(13, 59, 102, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
              },
            }
          }}
        />
        
        <Button
          variant="outlined"
          onClick={handleMenuOpen}
          startIcon={<FilterListIcon sx={{ color: theme === 'dark' ? '#93A8AC' : '#0D3B66' }} />}
          sx={{ 
            whiteSpace: 'nowrap',
            minWidth: 'auto',
            borderRadius: 2,
            borderColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
            color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
            '&:hover': {
              backgroundColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.1)' : 'rgba(13, 59, 102, 0.1)',
              borderColor: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
            },
          }}
        >
          Filter
        </Button>
        
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              backgroundColor: theme === 'dark' ? '#2d2d2d' : '#FFFFFF',
              color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
              border: theme === 'dark' ? '1px solid #444' : 'none',
              boxShadow: theme === 'dark' 
                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
            }
          }}
        >
          <MenuItem onClick={() => handleSearchTypeChange('all')}
            sx={{
              color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
              '&:hover': {
                backgroundColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.1)' : 'rgba(13, 59, 102, 0.1)',
              },
            }}
          >
            All Fields
          </MenuItem>
          <MenuItem onClick={() => handleSearchTypeChange('title')}
            sx={{
              color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
              '&:hover': {
                backgroundColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.1)' : 'rgba(13, 59, 102, 0.1)',
              },
            }}
          >
            Title Only
          </MenuItem>
          <MenuItem onClick={() => handleSearchTypeChange('content')}
            sx={{
              color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
              '&:hover': {
                backgroundColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.1)' : 'rgba(13, 59, 102, 0.1)',
              },
            }}
          >
            Content Only
          </MenuItem>
          <MenuItem onClick={() => handleSearchTypeChange('tags')}
            sx={{
              color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
              '&:hover': {
                backgroundColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.1)' : 'rgba(13, 59, 102, 0.1)',
              },
            }}
          >
            Tags Only
          </MenuItem>
          <MenuItem onClick={() => handleSearchTypeChange('date')}
            sx={{
              color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
              '&:hover': {
                backgroundColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.1)' : 'rgba(13, 59, 102, 0.1)',
              },
            }}
          >
            Date Only
          </MenuItem>
        </Menu>
      </Box>
      
      {searchType !== 'all' && (
        <Box sx={{ mt: 1 }}>
          <Chip 
            label={`Filtering by: ${searchType}`}
            size="small"
            onDelete={() => setSearchType('all')}
            sx={{
              backgroundColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.1)' : 'rgba(13, 59, 102, 0.1)',
              color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
              borderColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
              '& .MuiChip-deleteIcon': {
                color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                '&:hover': {
                  color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;