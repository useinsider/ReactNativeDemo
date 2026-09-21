import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, typography } from '../theme';

type CustomSectionProps = {
  title: string;
  children: React.ReactNode;
  style?: ViewStyle;
};

function CustomSection({ title, children, style }: CustomSectionProps) {
  return (
    <View style={[styles.section, style]}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginTop: 10,
    flex: 1,
  },
  title: {
    ...typography.title,
    marginBottom: 10,
    color: colors.onSurface,
  },
});

export default CustomSection;
