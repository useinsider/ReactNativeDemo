import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { playgroundLog } from '../playground/playgroundLog';

function Header() {
  return (
    <View style={styles.header}>
      <Image source={require('../../assets/insider-logo.png')} style={styles.logo} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Clear"
        hitSlop={8}
        onPress={playgroundLog.clear}
        style={styles.clearButton}
      >
        <Image source={require('../../assets/trash.png')} style={styles.clearIcon} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  logo: {
    width: 173,
    height: 24,
    resizeMode: 'contain',
  },
  // Matches the 48dp IconButton the Kotlin demo pins to the trailing edge.
  clearButton: {
    position: 'absolute',
    right: 10,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: {
    width: 24,
    height: 24,
    tintColor: colors.onSurface,
  },
});

export default Header;
