import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { colors } from '../theme';

function Header() {
  return (
    <View style={styles.header}>
      <Image source={require('../../assets/insider-logo.png')} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 320,
    height: 140,
    alignSelf: 'center',
    margin: 10,
  },
});

export default Header;
