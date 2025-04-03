// components/ThemedView.js
import React from 'react';
import { View } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

export function ThemedView({ style, lightColor, darkColor, ...otherProps }) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}