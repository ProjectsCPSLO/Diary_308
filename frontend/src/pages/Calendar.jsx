import React, { useContext } from 'react';
import MoodCalendar from '../components/MoodCalendar';
import { ThemeContext } from '../context/ThemeContext';
import { Box, Typography } from '@mui/material';

const CalendarPage = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 60,
        left: 0,
        backgroundColor: theme === 'dark' ? '#1c1c1c' : 'white',
        width: '100vw',
        height: '100vh',
        overflowY: 'auto', // Enables scrolling if needed
        textAlign: 'center', // Centers the heading and calendar horizontally
        paddingTop: '20px', // Adds spacing at the top
        transition: 'background-color 0.3s ease',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: theme === 'dark' ? '#90caf9' : '#000',
          marginBottom: '20px', // Adds spacing between heading and calendar
        }}
      >
        Mood Calendar
      </Typography>
      <Box
        sx={{
          display: 'inline-block', // Ensures the calendar stays centered
          width: 'fit-content',
        }}
      >
        <MoodCalendar />
      </Box>
    </Box>
  );
};

export default CalendarPage;
