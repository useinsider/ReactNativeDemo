import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

function CustomSection({ title, children, style }: CustomSectionProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = StyleSheet.create({
    section: {
      paddingRight: 20,
      paddingLeft: 20,
      marginTop: 10,
      flex: 1,
      ...style
    },
    title: {
      marginBottom: 10,
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? 'white' : 'black'
    },
  });

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </View>
  );
}

export default CustomSection;
