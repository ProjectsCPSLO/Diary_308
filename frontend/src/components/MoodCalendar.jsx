import React, { useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { moodColors } from '../constants/moodColors';
import { usePostsContext } from '../hooks/usePostsContext';
import { ThemeContext } from '../context/ThemeContext';
import { Box, Typography, Paper } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const MoodCalendar = () => {
  const { posts } = usePostsContext();
  const { theme } = useContext(ThemeContext);

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    const entry = posts?.find(
      (post) => new Date(post.date).toDateString() === date.toDateString()
    );
    
    if (entry && entry.mood) {
      return (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: moodColors[entry.mood] || '#808080',
            opacity: 0.7,
            zIndex: 1,
            borderRadius: '4px',
          }}
        />
      );
    }
    return null;
  };

  const tileClassName = ({ date }) => {
    const entry = posts?.find(
      (post) => new Date(post.date).toDateString() === date.toDateString()
    );

    if (entry && entry.mood) {
      return `has-mood mood-${entry.mood.toLowerCase().replace(' ', '-')}`;
    }
    return '';
  };

  return (
    <Box>
      {/* Title - Using the boxed version */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 2,
        mb: 3,
        py: 1.5,
        px: 3,
        borderRadius: 30,
        border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        width: 'fit-content',
        mx: 'auto'
      }}>
        <CalendarMonthIcon 
          sx={{ 
            fontSize: '2rem', 
            color: theme === 'dark' ? '#FFFFFF' : '#0D3B66' 
          }} 
        />
        <Typography
          variant="h4"
          sx={{
            color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
            fontWeight: 'bold',
          }}
        >
          Mood Calendar
        </Typography>
      </Box>
      
      {/* Centered Mood Key */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: '8px',
            backgroundColor: theme === 'dark' ? '#2d2d2d' : '#fff',
            color: theme === 'dark' ? '#fff' : '#0D3B66',
            border: theme === 'dark' ? '1px solid #444' : 'none',
            width: 'auto',
            maxWidth: '90%',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: theme === 'dark' ? '#93A8AC' : '#0D3B66', fontWeight: 'bold', textAlign: 'center' }}>
            Mood Key
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3, 
            justifyContent: 'center' 
          }}>
            {Object.entries(moodColors).map(([mood, color]) => (
              <Box 
                key={mood} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    width: 20, 
                    height: 20, 
                    backgroundColor: color,
                    borderRadius: '4px',
                    border: theme === 'dark' ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)'
                  }} 
                />
                <Typography variant="body2">
                  {mood}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>

      {/* Calendar Component */}
      <Box sx={{ 
        boxShadow: theme === 'dark' 
          ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
          : '0 8px 32px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        padding: '2px',
        backgroundColor: theme === 'dark' ? '#2d2d2d' : '#fff',
        border: theme === 'dark' ? '1px solid #444' : 'none',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <Calendar 
          tileContent={tileContent}
          tileClassName={tileClassName}
          className={theme === 'dark' ? 'calendar-dark' : 'calendar-light'}
        />
      </Box>

      {/* Help text - Single instance */}
      <Box sx={{ 
        mt: 3, 
        color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
        textAlign: 'center',
      }}>
        <Typography variant="body2">
          The calendar shows your mood entries for each day. Hover over a colored date to see your mood.
        </Typography>
      </Box>

      {/* Custom CSS for dark mode calendar */}
      <style>{`
        /* Fix for z-index issue with color blocks */
        .react-calendar__tile {
          position: relative;
          z-index: 0;
          height: 60px;
          padding-top: 10px;
        }
        
        /* Calendar dark mode */
        .calendar-dark {
          background-color: #2d2d2d;
          color: #fff;
          border: none;
          width: 100%;
        }
        
        .calendar-dark .react-calendar__navigation {
          margin-bottom: 10px;
        }
        
        .calendar-dark .react-calendar__navigation button {
          min-width: 44px;
          color: #fff;
          background-color: #0D3B66;
          border-radius: 4px;
          margin: 2px;
        }
        
        .calendar-dark .react-calendar__navigation button:enabled:hover,
        .calendar-dark .react-calendar__navigation button:enabled:focus {
          background-color: #93A8AC;
          color: #0D3B66;
        }
        
        /* Fix for calendar numbers in dark mode - make ALL numbers white and bold */
        .calendar-dark .react-calendar__tile {
          color: rgba(255, 255, 255, 0.9) !important;
          font-weight: 600 !important;
          text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
        }
        
        .calendar-dark .react-calendar__month-view__weekdays__weekday {
          padding: 8px;
          color: #93A8AC;
        }
        
        .calendar-dark .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
          font-weight: bold;
        }
        
        .calendar-dark .react-calendar__month-view__days__day--weekend {
          color: #ff8a80 !important;
        }
        
        .calendar-dark .react-calendar__tile:enabled:hover,
        .calendar-dark .react-calendar__tile:enabled:focus,
        .calendar-dark .react-calendar__tile--active {
          background-color: #93A8AC;
          color: #0D3B66 !important;
        }

        .calendar-dark .react-calendar__tile--now {
          background-color: rgba(147, 168, 172, 0.3);
        }
        
        /* Light mode */
        .calendar-light {
          width: 100%;
          border: none;
          background-color: #fff;
        }
        
        .calendar-light .react-calendar__navigation {
          margin-bottom: 10px;
        }
        
        .calendar-light .react-calendar__navigation button {
          min-width: 44px;
          background-color: #0D3B66;
          color: #fff;
          border-radius: 4px;
          margin: 2px;
        }
        
        .calendar-light .react-calendar__navigation button:enabled:hover,
        .calendar-light .react-calendar__navigation button:enabled:focus {
          background-color: #093057;
        }
        
        .calendar-light .react-calendar__month-view__weekdays__weekday {
          padding: 8px;
          color: #0D3B66;
        }
        
        .calendar-light .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
          font-weight: bold;
        }
        
        .calendar-light .react-calendar__tile:enabled:hover,
        .calendar-light .react-calendar__tile:enabled:focus,
        .calendar-light .react-calendar__tile--active {
          background-color: #0D3B66;
          color: #fff;
        }
        
        /* Shared styles */
        .react-calendar {
          font-family: Arial, sans-serif;
        }
        
        /* Important: Fix for mood entries */
        .has-mood {
          font-weight: bold !important;
          color: #000 !important; /* Black text for better visibility on colored backgrounds */
          position: relative;
          z-index: 2;
          transition: all 0.2s ease;
          text-shadow: none !important;
        }

        .has-mood:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        /* Tooltip effect */
        .has-mood::after {
          content: attr(title);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background-color: #000;
          color: white;
          text-align: center;
          padding: 5px 10px;
          border-radius: 6px;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
          white-space: nowrap;
          z-index: 10;
        }
        
        .has-mood:hover::after {
          opacity: 0.9;
        }
      `}</style>
    </Box>
  );
};

export default MoodCalendar;