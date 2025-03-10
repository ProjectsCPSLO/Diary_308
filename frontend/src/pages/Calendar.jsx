import React, { useContext } from 'react';
import MoodCalendar from '../components/MoodCalendar';
import { ThemeContext } from '../context/ThemeContext';
import { Box } from '@mui/material';

const CalendarPage = () => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 64, // Updated for new navbar height
        left: 0,
        backgroundColor: theme === 'dark' ? '#1c1c1c' : '#FFFFFF',
        width: '100vw',
        height: 'calc(100vh - 64px)', // Full height minus navbar
        overflowY: 'auto',
        padding: '30px 20px 50px',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Box
        sx={{
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        <MoodCalendar />
      </Box>
    </Box>
  );
};

export default CalendarPage;