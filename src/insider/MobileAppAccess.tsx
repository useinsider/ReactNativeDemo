import React from 'react';
import {View, StyleSheet} from 'react-native';

import CustomButton from '../components/CustomButton';
import Insider from 'react-native-insider';

function MobileAppAccessMethods() {
  const styles = StyleSheet.create({
    row: {
      width: '100%',
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  // --- MobileAppAccess --- //

  const setMobileAppAccess = (mobileAppAccess: boolean) => {
    Insider.setMobileAppAccess(mobileAppAccess);

    console.log('INSIDER MobileAppAccess Status: ' + mobileAppAccess);
  };

  return (
    <View style={styles.row}>
      <CustomButton
        text="MobileAppAccess True"
        onPress={() => {
          setMobileAppAccess(true);
        }}
      />
      <CustomButton
        text="MobileAppAccess False"
        onPress={() => {
          setMobileAppAccess(false);
        }}
      />
    </View>
  );
}

export default MobileAppAccessMethods;
