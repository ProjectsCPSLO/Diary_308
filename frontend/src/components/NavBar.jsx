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

const NavBar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');

  const handleClick = () => logout();

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#1976d2',
          height: '56px',
          display: 'flex',
          justifyContent: 'center',
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontSize: '1rem',
                }}
              >
                <Link
                  to="/"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                  }}
                >
                  Home
                </Link>
              </Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontSize: '1rem',
                  marginLeft: '20px',
                }}
              >
                <Link
                  to="/calendar"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                  }}
                >
                  Calendar
                </Link>
              </Typography>
              {user && (
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontSize: '1rem',
                    marginLeft: '20px',
                  }}
                >
                  <Link
                    to="/profile"
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                    }}
                  >
                    Profile
                  </Link>
                </Typography>
              )}
            </Box>

            
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontSize: '1.2rem',
                color: 'white',
              }}
            >
              The Diary App
            </Typography>

            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {user && (
                <IconButton
                  color="inherit"
                  onClick={toggleSearch}
                  sx={{ minWidth: 'auto', padding: 0 }}
                >
                  <SearchIcon />
                </IconButton>
              )}
              
              <Button
                color="inherit"
                onClick={toggleTheme}
                sx={{ minWidth: 'auto', padding: 0 }}
              >
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </Button>

              {user ? (
                <>
                  <Typography
                    variant="body1"
                    sx={{
                      marginRight: 2,
                      color: 'white',
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    {user.email}
                  </Typography>
                  <Button
                    color="inherit"
                    onClick={handleClick}
                    sx={{
                      color: 'white',
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/api/login"
                    sx={{
                      color: 'white',
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/api/signup"
                    sx={{
                      color: 'white',
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

      
      <Drawer
        anchor="top"
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        PaperProps={{
          sx: {
            pt: 1,
            pb: 2,
            px: 2,
            backgroundColor: theme === 'dark' ? '#1c1c1c' : '#ffffff',
          }
        }}
      >
        <Box sx={{
          display: 'flex', 
          justifyContent: 'flex-end',
          mb: 1
        }}>
          <IconButton onClick={() => setSearchOpen(false)}>
            <CloseIcon sx={{ color: theme === 'dark' ? '#fff' : '#000' }} />
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
    </>
  );
};

export default NavBar;