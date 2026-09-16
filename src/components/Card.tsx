import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme';

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.outline,
    elevation: 0,
    shadowOpacity: 0,
    padding: 16,
  },
});

export default Card;
