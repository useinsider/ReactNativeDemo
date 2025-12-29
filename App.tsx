/**
 * INSIDER - Sample React Native App
 * https://useinsider.com/
 *
 * @format
 */

import React, { useEffect } from 'react';
import { Alert, PermissionsAndroid, Platform, Linking } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Insider from 'react-native-insider';
import InsiderCallbackType from 'react-native-insider/src/InsiderCallbackType';
import MainScreen from './src/screens/MainScreen.tsx';
import MessageCenterScreen from './src/screens/MessageCenterScreen.tsx';

async function requestLocationPermission() {
  try {
    if (Platform.OS != 'android') return;

    const fineLocationGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: 'Application Camera Permission',
      message: 'The application requires access to the camera.',
      buttonNeutral: 'Ask Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });

    if (fineLocationGranted === PermissionsAndroid.RESULTS.GRANTED) {
      const bgLocationGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: 'Background Location Permission for App',
          message:
            'The app requires background location permission to provide you better service using your location in the background.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Deny',
          buttonPositive: 'Allow',
        },
      );

      if (bgLocationGranted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permissions successfully granted');
      } else {
        console.log('Background location permission not granted');
      }
    } else {
      console.log('Location permission not granted');
    }
  } catch (err) {
    console.warn(err);
  }
}

const initInsider = async () => {
  // FIXME-INSIDER: Please change with your partner name and app group.
  let partnerName = 'qaautomation1';
  let storedPartnerName = await AsyncStorage.getItem('insider_partner_name');

  if (storedPartnerName !== null) {
    partnerName = storedPartnerName;

    console.log('[INSIDER][init]: Partner name updated from storage. New Partner Name: ' + storedPartnerName);
  }

  Insider.init(partnerName, 'group.com.useinsider.ReactNativeDemo', (type, data) => {
    switch (type) {
      case InsiderCallbackType.NOTIFICATION_OPEN:
        console.log('[INSIDER][NOTIFICATION_OPEN]: ', data);
        Alert.alert('[INSIDER][NOTIFICATION_OPEN]:', JSON.stringify(data));
        break;
      case InsiderCallbackType.TEMP_STORE_CUSTOM_ACTION:
        console.log('[INSIDER][TEMP_STORE_CUSTOM_ACTION]: ', data);
        Alert.alert('[INSIDER][TEMP_STORE_CUSTOM_ACTION]: ', JSON.stringify(data));
        break;
      case InsiderCallbackType.INAPP_SEEN:
        console.log('[INSIDER][INAPP_SEEN]: ', data);
        break;
      case InsiderCallbackType.SESSION_STARTED:
        console.log('[INSIDER][SESSION_STARTED]: ', data);
        break;
    }
  });

  Insider.registerWithQuietPermission(false);
  Insider.setActiveForegroundPushView();
  Insider.startTrackingGeofence();
  Insider.enableIDFACollection(false);
  Insider.enableIpCollection(false);
  Insider.enableLocationCollection(false);
  Insider.enableCarrierCollection(false);

  console.log('[INSIDER] initialized');
};

const RootStack = createNativeStackNavigator({
  screens: {
    Main: {
      screen: MainScreen,
      options: {
        title: '[RN] Insider SDK Demo',
      },
    },
    MessageCenter: {
      screen: MessageCenterScreen,
      options: {
        title: 'Notifications',
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

function App() {
  const handleOpenURL = (event: { url: string }) => {
    const url = event.url;
    console.log('[INSIDER][handleOpenURL] triggered. URL: ' + url);
    Insider.handleUniversalLink(url);
  };

  useEffect(() => {
    Linking.getInitialURL().then(initialUrl => {
      if (initialUrl) {
        handleOpenURL({ url: initialUrl });
      }
    });

    const urlEventListener = Linking.addEventListener('url', handleOpenURL);

    return () => {
      urlEventListener.remove();
    };
  }, []);

  requestLocationPermission();
  initInsider();

  return <Navigation />;
}

export default App;
