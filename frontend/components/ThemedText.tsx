import React from 'react'
import { Text, useColorScheme, type TextProps, type StyleProp, type TextStyle } from 'react-native'
import { Colors } from '../constants/Colors'

type ThemedTextProps = TextProps & {
  title?: boolean
  style?: StyleProp<TextStyle>
}

const ThemedText: React.FC<ThemedTextProps> = ({ style, title = false, ...props }) => {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light

  const textColor = title ? theme.title : theme.text
  return (
    <Text
      style={[{ color: textColor }, style]}
      {...props}
    />
  )
}
export default ThemedText
