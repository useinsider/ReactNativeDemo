import React from "react";
import { View, StyleSheet, Platform } from "react-native";

import CustomButton from "../components/CustomButton";
import Insider from "react-native-insider";

// The native module turns this into an FCM data map; image_url makes the SDK download a rich push image.
export const SAMPLE_PUSH = {
  source: "Insider",
  title: "Demo push",
  message: "Sent from the demo",
  image_url: "https://www.gstatic.com/webp/gallery/1.jpg",
  camp_id: "1",
  camp_type: "1",
  variant_id: "1",
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
