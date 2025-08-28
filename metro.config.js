const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add web-specific module aliasing
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-maps': require.resolve('./web/react-native-maps-mock.js'),
};

// Block native-only files from being processed on web
config.resolver.blockList = [
  /node_modules\/react-native-maps\/src\/MapMarkerNativeComponent\.ts$/,
];

// Ensure web platform is properly configured
config.resolver.platforms = ['web', 'ios', 'android', 'native'];

module.exports = config;