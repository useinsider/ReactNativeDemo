import React from 'react';
import { View, TouchableHighlight, StyleSheet, Text, useColorScheme } from 'react-native';

function CustomButton({ text, buttonStyle, onPress }: DropDownProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = StyleSheet.create({
    button: {
      flex: 1,
      margin: 5,
      padding: 10,
      backgroundColor: isDarkMode ? '#F0F0F0' : 'black',
      borderRadius: 5,
      ...buttonStyle
    },
    buttonText: {
      fontSize: 14,
      color:  isDarkMode ? 'black': 'white',
      textAlign: 'center'
    }
  });

  return (
    <TouchableHighlight style={styles.button} onPress={onPress} underlayColor="#a8a8a8">
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableHighlight>
  );
}

export default CustomButton;
