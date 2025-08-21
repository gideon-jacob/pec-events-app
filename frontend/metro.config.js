// Prefer Expo's default Metro config; fall back to a minimal config if unavailable
let getDefaultConfig;
try {
  ({ getDefaultConfig } = require('expo/metro-config'))
} catch (_) {
  try {
    ({ getDefaultConfig } = require('@expo/metro-config'))
  } catch (_) {
    getDefaultConfig = undefined
  }
}

if (typeof getDefaultConfig === 'function') {
  const config = getDefaultConfig(__dirname)
  const existing = Array.isArray(config?.resolver?.sourceExts) ? config.resolver.sourceExts : []
  const merged = Array.from(new Set([...existing, 'cjs', 'mjs']))
  config.resolver = { ...(config.resolver || {}), sourceExts: merged }
  module.exports = config
} else {
  module.exports = {
    resolver: {
      sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs'],
    },
  }
}
