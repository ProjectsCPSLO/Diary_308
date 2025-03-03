// frontend/src/components/GeotagLocation.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Material UI imports (optional but recommended for consistent styling)
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

const GeotagLocation = ({ onLocationSelect, initialPosition = null }) => {
  const [position, setPosition] = useState(initialPosition);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);

  // Handle map clicks to set the marker
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        if (onLocationSelect) {
          onLocationSelect(e.latlng);
        }
      },
    });
    return position ? (
      <Marker position={position}>
        <Popup>You chose this location</Popup>
      </Marker>
    ) : null;
  }

  // Unified function to handle geocoding (called by button or Enter key)
  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({ query: searchQuery });

      if (results && results.length > 0) {
        // x => longitude, y => latitude
        const { x, y, label } = results[0];
        const newPosition = { lat: y, lng: x };

        setPosition(newPosition);
        if (onLocationSelect) {
          onLocationSelect(newPosition);
        }

        // Move the map to the new position
        if (mapRef.current) {
          mapRef.current.setView([y, x], 13);
        }
      } else {
        // Optional: show feedback if no results found
        console.log('No results found for:', searchQuery);
      }
    } catch (err) {
      console.error('Error with geocoding:', err);
    }
  };

  // Trigger search on Enter key
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // If `initialPosition` changes (e.g., in edit mode), update the marker
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  return (
    <Box>
      {/* Search row: text field + button */}
      <Box display="flex" gap={1} mb={1}>
        <TextField
          label="Search location..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          fullWidth
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      <MapContainer
        center={
          position
            ? [position.lat, position.lng]
            : [37.7749, -122.4194] // Fallback center (e.g., SF)
        }
        zoom={13}
        style={{ height: '400px', width: '100%' }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org/copyright">
            OpenStreetMap
          </a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </Box>
  );
};

export default GeotagLocation;
