import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const TestRefComponent = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    // Test ref functionality
    if (bottomSheetModalRef.current) {
      console.log('Bottom sheet ref is working correctly');
    }
  }, []);

  const handlePresentModalPress = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Ref Test Component</Text>
        <Text style={styles.subtitle}>
          This component tests ref functionality with React 19 and RN 0.79.5
        </Text>

        <TouchableOpacity style={styles.button} onPress={handlePresentModalPress}>
          <Text style={styles.buttonText}>Open Bottom Sheet</Text>
        </TouchableOpacity>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={['25%', '50%']}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>
              Bottom sheet content - ref is working!
            </Text>
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  contentText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default TestRefComponent; 