import React from 'react'
import { View, useColorScheme, type ViewProps, type StyleProp, type ViewStyle } from 'react-native'
import { Colors } from '../constants/Colors'

type ThemedViewProps = ViewProps & {
  style?: StyleProp<ViewStyle>
}

const ThemedView: React.FC<ThemedViewProps> = ({ style, ...props }) => {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light
  return (
    <View
      style={[{ backgroundColor: theme.background }, style]}
      {...props}
    />
  )
}

export default ThemedView
