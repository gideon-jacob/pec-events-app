const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure Metro supports Flow v0.275.0 and React Native 0.79.5


// Add support for additional file extensions
config.resolver.sourceExts = [
  'js',
  'jsx',
  'json',
  'ts',
  'tsx',
  'cjs',
  'mjs',
];

// Do not alias react-native to react-native-web globally; Expo handles web mapping.
module.exports = config;
