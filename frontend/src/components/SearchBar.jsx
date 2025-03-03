import React, { useState, useContext, useEffect } from 'react';
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

  
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        handleSearch();
      }
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [searchTerm, searchType]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    handleMenuClose();
  };

  const handleSearch = () => {
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
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color={theme === 'dark' ? 'info' : 'primary'} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={clearSearch}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              backgroundColor: theme === 'dark' ? '#3a3a3a' : '#f5f5f5',
              color: theme === 'dark' ? '#fff' : '#000',
              '&:hover': {
                backgroundColor: theme === 'dark' ? '#4a4a4a' : '#e5e5e5',
              },
            }
          }}
        />
        
        <Button
          variant="outlined"
          onClick={handleMenuOpen}
          startIcon={<FilterListIcon />}
          sx={{ 
            whiteSpace: 'nowrap',
            minWidth: 'auto',
            borderRadius: 2,
            borderColor: theme === 'dark' ? '#90caf9' : '#1976d2',
            color: theme === 'dark' ? '#90caf9' : '#1976d2',
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
              backgroundColor: theme === 'dark' ? '#424242' : '#fff',
              color: theme === 'dark' ? '#fff' : '#000',
            }
          }}
        >
          <MenuItem onClick={() => handleSearchTypeChange('all')}>
            All Fields
          </MenuItem>
          <MenuItem onClick={() => handleSearchTypeChange('title')}>
            Title Only
          </MenuItem>
          <MenuItem onClick={() => handleSearchTypeChange('content')}>
            Content Only
          </MenuItem>
          <MenuItem onClick={() => handleSearchTypeChange('tags')}>
            Tags Only
          </MenuItem>
          <MenuItem onClick={() => handleSearchTypeChange('date')}>
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
            color="primary"
            variant="outlined"
          />
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;