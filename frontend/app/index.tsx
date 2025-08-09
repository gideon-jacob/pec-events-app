import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import TestRefComponent from './test-ref';

type ApiResponse = {
  message: string;
};

const resolveApiBaseUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.replace(/\/$/, '');
  }

  // Fallback for web or unknown
  return 'http://localhost:5000';
};

const Home = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let isCancelled = false;

    const fetchData = async () => {
      try {
        const baseUrl = resolveApiBaseUrl();
        const response = await fetch(`${baseUrl}/api/hello`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const json = (await response.json()) as ApiResponse;
        if (!isCancelled) {
          setData(json);
        }
      } catch (error: unknown) {
        const aborted =
          controller.signal.aborted ||
          (typeof error === 'object' &&
            error !== null &&
            'name' in error &&
            (error as any).name === 'AbortError');
        if (aborted) {
          return;
        }

        let errorMessage = 'An unknown error occurred';
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else if (error && typeof error === 'object' && 'message' in error) {
          errorMessage = String((error as any).message);
        }
        if (!isCancelled) {
          setError(errorMessage);
        }
        console.error('Error fetching data:', error);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PEC Event App</Text>
      <Text style={styles.subtitle}>React 19 + React Native 0.79.5</Text>

      {loading ? (
        <View style={styles.statusContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.statusText}>Loading data...</Text>
        </View>
      ) : error ? (
        <View style={styles.statusContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      ) : (
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Message from Backend:</Text>
          <Text style={styles.dataText}>{data?.message}</Text>
        </View>
      )}

      <TestRefComponent />
    </View>
  );
};

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statusContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  dataContainer: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dataText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});