import { Linking, Alert, Platform } from 'react-native'

/**
 * Utility functions for handling phone calls and WhatsApp messaging
 */

export const contactUtils = {
  /**
   * Attempts to make a phone call using a simple, reliable approach
   * - Sanitizes number
   * - Tries tel: directly
   */
  async makePhoneCall(phoneNumber: string, showAlert: boolean = true): Promise<boolean> {
    const cleanPhone = (phoneNumber || '').replace(/\s/g, '').replace(/[^\d+]/g, '')
    if (!cleanPhone) {
      if (showAlert) Alert.alert('Invalid Number', 'Please provide a valid phone number.')
      return false
    }

    const telUrl = `tel:${cleanPhone}`

    try {
      await Linking.openURL(telUrl)
      return true
    } catch (error) {
      console.error('Phone call failed:', error)
      if (showAlert) {
        Alert.alert(
          'Cannot place call',
          'Unable to open the dialer on this device. Please dial the number manually.'
        )
      }
      return false
    }
  },

  /**
   * Attempts to open WhatsApp
   * - Tries app URL first
   * - Falls back to web link
   */
  async openWhatsApp(phoneNumber: string, message: string = '', showAlert: boolean = true): Promise<boolean> {
    const cleanPhone = (phoneNumber || '').replace(/\s/g, '').replace(/[^\d+]/g, '')
    if (!cleanPhone) {
      if (showAlert) Alert.alert('Invalid Number', 'Please provide a valid phone number.')
      return false
    }

    const appUrl = `whatsapp://send?phone=${cleanPhone}${message ? `&text=${encodeURIComponent(message)}` : ''}`
    const webUrl = `https://wa.me/${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ''}`

    try {
      await Linking.openURL(appUrl)
      return true
    } catch (e1) {
      try {
        await Linking.openURL(webUrl)
        return true
      } catch (e2) {
        console.error('WhatsApp open failed:', { appUrl, webUrl, e1, e2 })
        if (showAlert) {
          Alert.alert(
            'WhatsApp not available',
            'WhatsApp is not installed and the web link could not be opened.'
          )
        }
        return false
      }
    }
  },

  /**
   * Formats a phone number for display
   */
  formatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) return ''
    const cleaned = phoneNumber.replace(/[^\d+]/g, '')
    if (cleaned.startsWith('+91') && cleaned.length === 13) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`
    }
    if (cleaned.length === 10 && !cleaned.startsWith('+')) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
    }
    return phoneNumber
  }
}
