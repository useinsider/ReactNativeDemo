import React, { useRef } from "react";
import { View, StyleSheet, Platform } from "react-native";

import CustomButton from "../components/CustomButton";
import Insider from "react-native-insider";

// The native module turns this into an FCM data map; it only has to reach the SDK without a crash.
export const SAMPLE_PUSH = {
  source: "Insider",
  title: "Demo push",
  message: "Sent from the demo",
};

function PushMethods() {
  const styles = StyleSheet.create({
    row: {
      width: "100%",
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  // The SDK adds a JS listener on every setForegroundPushCallback call and never removes it.
  const foregroundCallbackRegistered = useRef(false);

  const handleNotification = () => {
    Insider.handleNotification(SAMPLE_PUSH);
    console.log("[INSIDER][handleNotification]: Method is triggered.");
  };

  const triggerPushProcess = () => {
    Insider.triggerPushProcessWithNotificationData(SAMPLE_PUSH);
    console.log("[INSIDER][triggerPushProcessWithNotificationData]: Method is triggered.");
  };

  const setHybridPushToken = () => {
    Insider.setHybridPushToken("demo-hybrid-token");
    console.log("[INSIDER][setHybridPushToken]: Method is triggered.");
  };

  const setForegroundPushCallback = () => {
    if (foregroundCallbackRegistered.current) {
      return;
    }
    foregroundCallbackRegistered.current = true;
    Insider.setForegroundPushCallback((notification) => {
      console.log("[INSIDER][foregroundPush]: ", notification);
    });
    console.log("[INSIDER][setForegroundPushCallback]: Method is triggered.");
  };

  return (
    <View>
      <View style={styles.row}>
        <CustomButton text="Handle Notification" onPress={handleNotification} />
        <CustomButton text="Trigger Push Process" onPress={triggerPushProcess} />
      </View>
      <View style={styles.row}>
        {Platform.OS === "android" && (
          <CustomButton text="Set Hybrid Push Token" onPress={setHybridPushToken} />
        )}
        <CustomButton text="Set Foreground Push Callback" onPress={setForegroundPushCallback} />
      </View>
    </View>
  );
}

export default PushMethods;
