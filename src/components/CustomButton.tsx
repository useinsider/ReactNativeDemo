import React from 'react';
import { StyleSheet, Text, TouchableHighlight, ViewStyle } from 'react-native';
import { colors, typography } from '../theme';

type CustomButtonProps = {
  text: string;
  buttonStyle?: ViewStyle;
  onPress: () => void;
};

function CustomButton({ text, buttonStyle, onPress }: CustomButtonProps) {
  return (
    <TouchableHighlight
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      underlayColor={colors.orangeDark}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: colors.orange,
    borderRadius: 18,
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
    textAlign: 'center',
  },
});

export default CustomButton;
