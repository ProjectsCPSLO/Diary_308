import React from 'react';
import { Button } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const writingPrompts = [
  'What made you smile today?',
  "What's a challenge you faced today and how did you handle it?",
  'Describe a conversation that impacted you today.',
  'What are you grateful for right now?',
  "What's something new you learned today?",
  'Describe a moment that surprised you today.',
  "What's something you're looking forward to?",
  'Write about a decision you made today.',
  'What would you like to improve about today if you could?',
  'Describe your current mood and what influenced it.',
  "What's a goal you're working towards?",
  'Write about a person who made an impact on your day.',
  "What's a memory that came to mind today?",
  'Describe your ideal day tomorrow.',
  "What's something you're proud of today?",
  'Write about a place you visited or would like to visit.',
  "What's something that challenged your perspective today?",
  'Describe a small moment of joy from today.',
  "What's something you want your future self to remember about today?",
  "Write about a change you've noticed in yourself lately.",
  "What's a question you're pondering right now?",
  "Describe a habit you're trying to build or break.",
  "What's something you want to explore or learn more about?",
  'Write about an interaction that made you think.',
  "What's a hope or fear you're experiencing right now?",
];

const WritingPrompts = ({ onSelectPrompt }) => {
  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * writingPrompts.length);
    return writingPrompts[randomIndex];
  };

  const handleGetPrompt = () => {
    const prompt = getRandomPrompt();
    onSelectPrompt(prompt);
  };

  return (
    <Button
      onClick={handleGetPrompt}
      variant="outlined"
      startIcon={<AutoAwesomeIcon />}
      sx={{
        width: 'fit-content',
        color: '#1976d2',
        borderColor: '#1976d2',
        '&:hover': {
          borderColor: '#1565c0',
          backgroundColor: 'rgba(25, 118, 210, 0.04)',
        },
        textTransform: 'none',
        fontSize: '1rem',
      }}
    >
      Need inspiration?
    </Button>
  );
};

export default WritingPrompts;
