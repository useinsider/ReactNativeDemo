/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import messaging from "@react-native-firebase/messaging";
import RNInsider from "react-native-insider";

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log(
    "[FCM][setBackgroundMessageHandler]: Message handled in the background :" + JSON.stringify(remoteMessage)
  );

  if ((remoteMessage.data || {}).source === "Insider") {
    RNInsider.handleNotification(remoteMessage.data);
  }
});

AppRegistry.registerComponent(appName, () => App);