import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout.js';
import { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SearchIcon from '@mui/icons-material/Search';
import { FaSun, FaMoon } from 'react-icons/fa';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import SearchBar from './SearchBar';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import MapIcon from '@mui/icons-material/Map';

const NavBar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');

  const handleClick = () => logout();

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.email) return '?';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: theme === 'dark' ? '#1e1e1e' : '#FFFFFF',
          borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#93A8AC'}`,
          height: '64px',
          display: 'flex',
          justifyContent: 'center',
          color: theme === 'dark' ? '#fff' : '#0D3B66',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: 'unset',
              padding: '0 10px',
            }}
          >
            {/* Mobile menu button */}
            {isMobile && (
              <IconButton
                edge="start"
                aria-label="menu"
                onClick={toggleMobileMenu}
                sx={{ mr: 1 }}
              >
                <MenuIcon sx={{ color: theme === 'dark' ? '#fff' : '#0D3B66' }} />
              </IconButton>
            )}

            {/* App Logo/Title - centered on mobile, left on desktop */}
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                flexGrow: isMobile ? 1 : 0,
                textAlign: isMobile ? 'center' : 'left',
                color: theme === 'dark' ? '#fff' : '#0D3B66',
              }}
            >
              The Diary App
            </Typography>

            {/* Navigation Links - hidden on mobile */}
            {!isMobile && (
              <Box sx={{ display: 'flex', mx: 4, flexGrow: 1 }}>
                <Button
                  component={Link}
                  to="/"
                  sx={{
                    mx: 1,
                    color: theme === 'dark' ? '#fff' : '#0D3B66',
                    '&:hover': {
                      backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                      color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
                    },
                    transition: 'all 0.2s ease',
                    borderRadius: '4px',
                    paddingX: 1.5,
                  }}
                  startIcon={
                    <HomeIcon style={{ color: theme === 'dark' ? '#fff' : '#0D3B66' }} />
                  }
                >
                  Home
                </Button>

                <Button
                  component={Link}
                  to="/calendar"
                  sx={{
                    mx: 1,
                    color: theme === 'dark' ? '#fff' : '#0D3B66',
                    '&:hover': {
                      backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                      color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
                    },
                    transition: 'all 0.2s ease',
                    borderRadius: '4px',
                    paddingX: 1.5,
                  }}
                  startIcon={
                    <CalendarMonthIcon style={{ color: theme === 'dark' ? '#fff' : '#0D3B66' }} />
                  }
                >
                  Calendar
                </Button>

                {user && (
                  <>
                    <Button
                      component={Link}
                      to="/profile"
                      sx={{
                        mx: 1,
                        color: theme === 'dark' ? '#fff' : '#0D3B66',
                        '&:hover': {
                          backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                          color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
                        },
                        transition: 'all 0.2s ease',
                        borderRadius: '4px',
                        paddingX: 1.5,
                      }}
                      startIcon={
                        <PersonIcon style={{ color: theme === 'dark' ? '#fff' : '#0D3B66' }} />
                      }
                    >
                      Profile
                    </Button>

                    <Button
                      component={Link}
                      to="/posts-map"
                      sx={{
                        mx: 1,
                        color: theme === 'dark' ? '#fff' : '#0D3B66',
                        '&:hover': {
                          backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                          color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
                        },
                        transition: 'all 0.2s ease',
                        borderRadius: '4px',
                        paddingX: 1.5,
                      }}
                      startIcon={
                        <MapIcon style={{ color: theme === 'dark' ? '#fff' : '#0D3B66' }} />
                      }
                    >
                      Map
                    </Button>
                  </>
                )}
              </Box>
            )}

            {/* Right side controls */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {user && (
                <Tooltip title="Search">
                  <IconButton
                    onClick={toggleSearch}
                    sx={{ 
                      mx: 1,
                    }}
                  >
                    <SearchIcon sx={{ color: theme === 'dark' ? '#fff' : '#0D3B66' }} />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}>
                <IconButton
                  onClick={toggleTheme}
                  sx={{ 
                    mx: 1,
                  }}
                >
                  {theme === 'light' 
                    ? <FaMoon style={{ color: '#0D3B66' }} /> 
                    : <FaSun style={{ color: '#FFD700' }} />
                  }
                </IconButton>
              </Tooltip>

              {user ? (
                <>
                  <Tooltip title={user.email}>
                    <Avatar 
                      sx={{ 
                        bgcolor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                        width: 36, 
                        height: 36,
                        mx: 1, 
                        fontSize: '0.9rem',
                        color: theme === 'dark' ? '#0D3B66' : '#fff'
                      }}
                    >
                      {getUserInitials()}
                    </Avatar>
                  </Tooltip>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleClick}
                    sx={{
                      ml: 1,
                      borderColor: theme === 'dark' ? '#fff' : '#0D3B66',
                      color: theme === 'dark' ? '#fff' : '#0D3B66',
                      '&:hover': {
                        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(13,59,102,0.1)',
                        borderColor: theme === 'dark' ? '#fff' : '#0D3B66',
                      },
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/api/login"
                    variant="text"
                    sx={{
                      mx: 1,
                      color: theme === 'dark' ? '#fff' : '#0D3B66',
                      '&:hover': {
                        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(13,59,102,0.1)',
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/api/signup"
                    variant="contained"
                    sx={{
                      ml: 1,
                      backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                      color: theme === 'dark' ? '#0D3B66' : '#fff',
                      '&:hover': {
                        backgroundColor: theme === 'dark' ? '#FFFFFF' : '#093057',
                      },
                    }}
                  >
                    Signup
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile menu drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: {
            width: 240,
            backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
            color: theme === 'dark' ? '#fff' : '#0D3B66',
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Menu</Typography>
            <IconButton onClick={toggleMobileMenu}>
              <CloseIcon sx={{ color: theme === 'dark' ? '#fff' : '#0D3B66' }} />
            </IconButton>
          </Box>
          
          <Button
            component={Link}
            to="/"
            onClick={toggleMobileMenu}
            sx={{
              justifyContent: 'flex-start',
              mb: 1,
              py: 1,
              color: theme === 'dark' ? '#fff' : '#0D3B66',
              '&:hover': {
                backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
              },
              transition: 'all 0.2s ease',
              borderRadius: '4px',
            }}
            startIcon={
              <HomeIcon style={{ color: theme === 'dark' ? '#fff' : '#0D3B66' }} />
            }
          >
            Home
          </Button>
          
          <Button
            component={Link}
            to="/calendar"
            onClick={toggleMobileMenu}
            sx={{
              justifyContent: 'flex-start',
              mb: 1,
              py: 1,
              color: theme === 'dark' ? '#fff' : '#0D3B66',
              '&:hover': {
                backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
              },
              transition: 'all 0.2s ease',
              borderRadius: '4px',
            }}
            startIcon={
              <CalendarMonthIcon style={{ color: theme === 'dark' ? '#fff' : '#0D3B66' }} />
            }
          >
            Calendar
          </Button>
          
          {user && (
            <>
              <Button
                component={Link}
                to="/profile"
                onClick={toggleMobileMenu}
                sx={{
                  justifyContent: 'flex-start',
                  mb: 1,
                  py: 1,
                  color: theme === 'dark' ? '#fff' : '#0D3B66',
                  '&:hover': {
                    backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                    color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
                  },
                  transition: 'all 0.2s ease',
                  borderRadius: '4px',
                }}
                startIcon={
                  <PersonIcon style={{ color: theme === 'dark' ? '#fff' : '#0D3B66' }} />
                }
              >
                Profile
              </Button>
              
              <Button
                component={Link}
                to="/posts-map"
                onClick={toggleMobileMenu}
                sx={{
                  justifyContent: 'flex-start',
                  mb: 1,
                  py: 1,
                  color: theme === 'dark' ? '#fff' : '#0D3B66',
                  '&:hover': {
                    backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
                    color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
                  },
                  transition: 'all 0.2s ease',
                  borderRadius: '4px',
                }}
                startIcon={
                  <MapIcon style={{ color: theme === 'dark' ? '#fff' : '#0D3B66' }} />
                }
              >
                Map
              </Button>
            </>
          )}
          
          {user && (
            <Box sx={{ mt: 'auto', borderTop: 1, borderColor: theme === 'dark' ? '#333' : '#e0e0e0', pt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.7, color: theme === 'dark' ? '#fff' : '#0D3B66' }}>
                {user.email}
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleClick}
                sx={{
                  borderColor: theme === 'dark' ? '#fff' : '#0D3B66',
                  color: theme === 'dark' ? '#fff' : '#0D3B66',
                  '&:hover': {
                    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(13,59,102,0.1)',
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
      
      {/* Search drawer */}
      <Drawer
        anchor="top"
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        PaperProps={{
          sx: {
            pt: 1,
            pb: 2,
            px: 2,
            mt: '64px', // Account for AppBar height
            backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
            borderTop: `1px solid ${theme === 'dark' ? '#333' : '#93A8AC'}`,
          }
        }}
      >
        <Box sx={{
          display: 'flex', 
          justifyContent: 'flex-end',
          mb: 1
        }}>
          <IconButton onClick={() => setSearchOpen(false)}>
            <CloseIcon sx={{ color: theme === 'dark' ? '#fff' : '#0D3B66' }} />
          </IconButton>
        </Box>
        <SearchBar 
          onSearchResults={(results) => {
            if (isMobile) {
              setSearchOpen(false);
            }
          }} 
        />
      </Drawer>
      
      {/* Spacer to prevent content from hiding under the fixed AppBar */}
      <Toolbar />
    </>
  );
};

export default NavBar;