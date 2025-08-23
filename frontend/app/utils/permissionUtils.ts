import { Platform, Alert, Linking } from 'react-native'
import { Permission, request, PERMISSIONS, RESULTS } from 'react-native-permissions'

/**
 * Utility functions for handling Android permissions
 */

export const permissionUtils = {
  /**
   * Request phone call permission for Android
   * @returns Promise<boolean> - Whether permission was granted
   */
  async requestPhoneCallPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true // iOS doesn't need this permission
    }

    try {
      const result = await request(PERMISSIONS.ANDROID.CALL_PHONE)
      
      switch (result) {
        case RESULTS.GRANTED:
          return true
        case RESULTS.DENIED:
          return false
        case RESULTS.BLOCKED:
          // Permission is blocked, show settings dialog
          Alert.alert(
            'Permission Required',
            'Phone call permission is required to make calls. Please enable it in Settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Settings', 
                onPress: () => {
                  Linking.openSettings()
                }
              }
            ]
          )
          return false
        default:
          return false
      }
    } catch (error) {
      console.error('Permission request failed:', error)
      return false
    }
  },

  /**
   * Check if phone call permission is granted
   * @returns Promise<boolean> - Whether permission is granted
   */
  async checkPhoneCallPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true // iOS doesn't need this permission
    }

    try {
      const { check, PERMISSIONS, RESULTS } = await import('react-native-permissions')
      const result = await check(PERMISSIONS.ANDROID.CALL_PHONE)
      return result === RESULTS.GRANTED
    } catch (error) {
      console.error('Permission check failed:', error)
      return false
    }
  }
}
