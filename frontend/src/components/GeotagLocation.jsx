import React, { useState, useEffect, useContext } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ThemeContext } from '../context/ThemeContext';

// Material UI imports
import { TextField, Button, Box } from '@mui/material';

// Fix default icon paths if needed
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component that listens for map clicks to update location.
function LocationMarker({ position, onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return position ? (
    <Marker position={position}>
      <Popup>You chose this location</Popup>
    </Marker>
  ) : null;
}

// Component to re-center the map when coordinates change.
function SearchHandler({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], 13);
    }
  }, [coords, map]);
  return null;
}

const GeotagLocation = ({ onLocationSelect, initialPosition = null }) => {
  const { theme } = useContext(ThemeContext);
  const [position, setPosition] = useState(initialPosition);
  const [searchQuery, setSearchQuery] = useState('');

  // On mount, if no position, try to get the user's current location.
  useEffect(() => {
    if (!initialPosition && !position && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(userPos);
          onLocationSelect && onLocationSelect(userPos);
        },
        (err) => {
          console.error('Error retrieving location:', err);
          // Fallback to San Francisco if geolocation fails.
          setPosition({ lat: 37.7749, lng: -122.4194 });
          onLocationSelect && onLocationSelect({ lat: 37.7749, lng: -122.4194 });
        }
      );
    }
  }, [initialPosition, position, onLocationSelect]);

  // Handle geocoding when the user searches.
  const handleSearch = async () => {
    console.log('Searching for:', searchQuery);
    if (!searchQuery) return;

    try {
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({ query: searchQuery });
      console.log('Geocode results:', results);

      if (results && results.length > 0) {
        // x: longitude, y: latitude.
        const { x, y } = results[0];
        const newPosition = { lat: y, lng: x };
        console.log('Using coords:', newPosition);
        setPosition(newPosition);
        onLocationSelect && onLocationSelect(newPosition);
      } else {
        console.log('No results found for:', searchQuery);
      }
    } catch (err) {
      console.error('Error with geocoding:', err);
    }
  };

  // Allow search via the Enter key.
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Reset map to user's current location without hiding it.
  const resetMap = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(userPos);
          onLocationSelect && onLocationSelect(userPos);
        },
        (err) => {
          console.error('Error retrieving location:', err);
        }
      );
    }
  };

  // Update position when initialPosition changes.
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  // Dark mode map styles
  const getDarkModeMapUrl = () => {
    return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  };

  const getLightModeMapUrl = () => {
    return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  };

  return (
    <Box>
      {/* Search row: text field + Search button */}
      <Box display="flex" gap={1} mb={1}>
        <TextField
          label="Search location..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          fullWidth
          InputProps={{
            style: {
              color: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
            },
          }}
          InputLabelProps={{
            style: { color: theme === 'dark' ? '#93A8AC' : '#0D3B66' },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.3)' : 'rgba(13, 59, 102, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
              },
              '&.Mui-focused fieldset': {
                borderColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
              },
            },
          }}
        />
        <Button 
          variant="contained" 
          onClick={handleSearch}
          sx={{
            backgroundColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
            color: theme === 'dark' ? '#0D3B66' : '#FFFFFF',
            '&:hover': {
              backgroundColor: theme === 'dark' ? '#FFFFFF' : '#093057',
            },
            transition: 'all 0.2s ease',
          }}
        >
          SEARCH
        </Button>
      </Box>

      {/* Reset Map button */}
      <Box mb={1}>
        <Button 
          variant="outlined" 
          onClick={resetMap}
          sx={{
            color: theme === 'dark' ? '#93A8AC' : '#0D3B66',
            borderColor: theme === 'dark' ? '#93A8AC' : '#0D3B66',
            '&:hover': {
              backgroundColor: theme === 'dark' ? 'rgba(147, 168, 172, 0.1)' : 'rgba(13, 59, 102, 0.1)',
              borderColor: theme === 'dark' ? '#FFFFFF' : '#0D3B66',
            },
          }}
        >
          RESET MAP
        </Button>
      </Box>

      <MapContainer
        key={position ? `${position.lat}-${position.lng}` : 'default'}
        center={
          position
            ? [position.lat, position.lng]
            : [37.7749, -122.4194] // Fallback if no location is set.
        }
        zoom={13}
        style={{ 
          height: '400px', 
          width: '100%',
          borderRadius: '8px',
          border: `1px solid ${theme === 'dark' ? 'rgba(147, 168, 172, 0.3)' : 'rgba(13, 59, 102, 0.3)'}`, 
        }}
      >
        <TileLayer
          attribution={theme === 'dark' 
            ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            : '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
          url={theme === 'dark' ? getDarkModeMapUrl() : getLightModeMapUrl()}
        />
        <LocationMarker
          position={position}
          onLocationSelect={(latlng) => {
            setPosition(latlng);
            onLocationSelect && onLocationSelect(latlng);
          }}
        />
        <SearchHandler coords={position} />
      </MapContainer>
    </Box>
  );
};

export default GeotagLocation;