import Constants from 'expo-constants';

// Get the API URL from the app config or fall back to environment variables
export const getApiBaseUrl = (): string => {
  // First try to get from app config (for production builds)
  const configApiUrl = Constants.expoConfig?.extra?.apiUrl;
  if (configApiUrl) return configApiUrl;

  // Fall back to environment variables
  const envApiUrl = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.EXPO_PUBLIC_API_URL;
  if (envApiUrl) return envApiUrl;

  // Default fallback - replace with your production URL before building the APK
  return 'https://3lgkw9cxpk.execute-api.ap-south-1.amazonaws.com/default';
};

// Export the base URL with trailing slashes removed
export const API_BASE_URL = getApiBaseUrl().replace(/\/+$/, '');

// Helper function to get full API URL for a given endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
};
