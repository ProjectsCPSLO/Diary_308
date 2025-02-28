import React, { useState } from 'react';
import { Chip, TextField, Box } from '@mui/material';

const TagsInput = ({ tags, setTags, theme }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        label="Add Tags"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleInputKeyDown}
        placeholder="Press Enter to add tags"
        sx={{
          mb: 1,
          backgroundColor: theme === 'dark' ? '#616161' : 'inherit',
          borderRadius: '4px',
          '& .MuiInputBase-input': {
            color: theme === 'dark' ? 'white' : 'black',
          },
        }}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onDelete={() => handleDeleteTag(tag)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );
};

export default TagsInput;
