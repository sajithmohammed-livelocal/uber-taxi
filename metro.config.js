const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add web-specific module aliasing
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-maps': require.resolve('./web/react-native-maps-mock.js'),
};

// Ensure web platform is properly configured
config.resolver.platforms = ['web', 'ios', 'android', 'native'];

module.exports = config;