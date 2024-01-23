/**
 * INSIDER - Sample React Native App
 * https://useinsider.com/
 *
 * @format
 */

import React, { useState, useEffect } from "react";
import type { PropsWithChildren } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
} from "react-native";

import {
  Colors,
  DebugInstructions,
  LearnMoreLinks,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";

import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from "./src/components/Header";
import CustomSection from "./src/components/CustomSection";

import UserAttribute from "./src/insider/UserAttribute";
import UserIdentifier from "./src/insider/UserIdentifier";
import Event from "./src/insider/Event";
import Product from "./src/insider/Product";
import Purchase from "./src/insider/Purchase";
import SmartRecommender from "./src/insider/SmartRecommender";
import SocialProof from "./src/insider/SocialProof";
import PageVisit from "./src/insider/PageVisit";
import GDPR from "./src/insider/GDPR";
import MessageCenter from "./src/insider/MessageCenter";
import ContentOptimizer from "./src/insider/ContentOptimizer";
import ReinitWithPartnerName from "./src/insider/ReinitWithPartnerName";

import RNInsider from "react-native-insider";
import InsiderCallbackType from "react-native-insider/src/InsiderCallbackType";

function Section({ children, title }: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

async function requestLocationPermission() {
  try {
    if (Platform.OS != "android") return;

    const fineLocationGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Application Camera Permission",
        message: "The application requires access to the camera.",
        buttonNeutral: "Ask Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );

    if (fineLocationGranted === PermissionsAndroid.RESULTS.GRANTED) {
      const bgLocationGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: "Background Location Permission for App",
          message:
            "The app requires background location permission to provide you better service using your location in the background.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Deny",
          buttonPositive: "Allow",
        }
      );

      if (bgLocationGranted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Location permissions successfully granted");
      } else {
        console.log("Background location permission not granted");
      }
    } else {
      console.log("Location permission not granted");
    }
  } catch (err) {
    console.warn(err);
  }
}

const initInsider = async () => {
  // FIXME-INSIDER: Please change with your partner name and app group.
  let partnerName = "your_default_partner_name"
  let storedPartnerName = await AsyncStorage.getItem('insider_partner_name');

  if (storedPartnerName !== null) {
    partnerName = storedPartnerName;

    console.log("[INSIDER][init]: Partner name updated from storage. New Partner Name: " + storedPartnerName);
  }

  RNInsider.init(
    partnerName,
    "group.com.useinsider.ReactNativeDemo",
    (type, data) => {
      switch (type) {
        case InsiderCallbackType.NOTIFICATION_OPEN:
          console.log("[INSIDER][NOTIFICATION_OPEN]: ", data);
          Alert.alert("[INSIDER][NOTIFICATION_OPEN]:", JSON.stringify(data));
          break;
        case InsiderCallbackType.TEMP_STORE_CUSTOM_ACTION:
          console.log("[INSIDER][TEMP_STORE_CUSTOM_ACTION]: ", data);
          Alert.alert(
            "[INSIDER][TEMP_STORE_CUSTOM_ACTION]: ",
            JSON.stringify(data)
          );
          break;
        case InsiderCallbackType.INAPP_SEEN:
          console.log("[INSIDER][INAPP_SEEN]: ", data);
          break;
      }
    }
  );

  RNInsider.registerWithQuietPermission(false);
  RNInsider.setActiveForegroundPushView();
  RNInsider.startTrackingGeofence();
  RNInsider.enableIDFACollection(false);
  RNInsider.enableIpCollection(false);
  RNInsider.enableLocationCollection(false);
  RNInsider.enableCarrierCollection(false);

  console.log("[INSIDER] initialized");
};

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.black : Colors.white,
  };

  const handleOpenURL = (event) => {
    const url = event.url;

    console.log("[INSIDER][handleOpenURL] triggered. URL: " + url);

    RNInsider.handleUniversalLink(url);
  };

  useEffect(() => {
    Linking.getInitialURL().then((initialUrl) => {
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

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}
        >
          <Section title="[RN] Insider SDK Demo">
            This Demo contains simple methods that you can use with the Insider
            SDK.
          </Section>

          <CustomSection title="Reinit With Partner Name">
            <ReinitWithPartnerName />
          </CustomSection>

          <CustomSection title="User Attributes">
            <UserAttribute />
          </CustomSection>

          <CustomSection title="User Identifiers">
            <UserIdentifier />
          </CustomSection>

          <CustomSection title="Event">
            <Event />
          </CustomSection>

          <CustomSection title="Product">
            <Product />
          </CustomSection>

          <CustomSection title="Purchase">
            <Purchase />
          </CustomSection>

          <CustomSection title="Smart Recommender">
            <SmartRecommender />
          </CustomSection>

          <CustomSection title="Social Proof">
            <SocialProof />
          </CustomSection>

          <CustomSection title="Page Visit Methods">
            <PageVisit />
          </CustomSection>

          <CustomSection title="GDPR">
            <GDPR />
          </CustomSection>

          <CustomSection title="Message Center">
            <MessageCenter />
          </CustomSection>

          <CustomSection title="Content Optimizer">
            <ContentOptimizer />
          </CustomSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
});

export default App;
