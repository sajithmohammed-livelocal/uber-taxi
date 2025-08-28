// Mock implementation of react-native-maps for web platform
import React from 'react';

// Mock MapView component
const MapView = ({ children, style, ...props }) => {
  return React.createElement('div', {
    style: {
      ...style,
      backgroundColor: '#E5E7EB',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
  }, children);
};

// Mock Marker component
const Marker = ({ coordinate, title, children, ...props }) => {
  return React.createElement('div', {
    style: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 20,
      height: 20,
      backgroundColor: '#EF4444',
      borderRadius: '50%',
      border: '2px solid white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
  });
};

// Mock provider constant
const PROVIDER_GOOGLE = 'google';

// Export all components and constants
export default MapView;
export { Marker, PROVIDER_GOOGLE };