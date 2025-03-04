// frontend/src/components/GeotagLocation.jsx
import React, { useState, useEffect } from 'react';
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

// Material UI imports
import { TextField, Button, Box } from '@mui/material';

// Fix default icon paths
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// This component listens for map clicks to update the location.
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

// This component uses the map instance to re-center the map whenever 'coords' changes.
function SearchHandler({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], 16);
    }
  }, [coords, map]);
  return null;
}

const GeotagLocation = ({ onLocationSelect, initialPosition = null }) => {
  const [position, setPosition] = useState(initialPosition);
  const [searchQuery, setSearchQuery] = useState('');

  // Called when the user searches for a location.
  const handleSearch = async () => {
    console.log("Searching for:", searchQuery);
    if (!searchQuery) return;

    try {
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({ query: searchQuery });
      console.log("Geocode results:", results);

      if (results && results.length > 0) {
        // x is longitude, y is latitude
        const { x, y } = results[0];
        const newPosition = { lat: y, lng: x };
        console.log("Using coords:", y, x);

        setPosition(newPosition);
        onLocationSelect && onLocationSelect(newPosition);
      } else {
        console.log("No results found for:", searchQuery);
      }
    } catch (err) {
      console.error("Error with geocoding:", err);
    }
  };

  // Allow search via Enter key.
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Update position when initialPosition changes (e.g., in edit mode).
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
            : [37.7749, -122.4194] // Fallback center (San Francisco)
        }
        zoom={13}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org/copyright">
            OpenStreetMap
          </a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={position}
          onLocationSelect={(latlng) => {
            setPosition(latlng);
            onLocationSelect && onLocationSelect(latlng);
          }}
        />
        {/* Re-center the map when position updates */}
        <SearchHandler coords={position} />
      </MapContainer>
    </Box>
  );
};

export default GeotagLocation;
