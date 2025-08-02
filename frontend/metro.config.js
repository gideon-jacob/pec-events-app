const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure Metro supports Flow v0.275.0 and React Native 0.79.5
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

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

// Ensure proper handling of React Native modules
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native$': 'react-native-web',
};

module.exports = config; 