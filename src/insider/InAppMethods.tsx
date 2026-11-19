import React from "react";
import { View, StyleSheet, Platform } from "react-native";

import CustomButton from "../components/CustomButton";
import Insider from "react-native-insider";

function InAppMethods() {
  const styles = StyleSheet.create({
    row: {
      width: "100%",
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  const removeInapp = () => {
    Insider.removeInapp();
    console.log("[INSIDER][removeInapp]: Method is triggered.");
  };

  const showNativeAppReview = () => {
    Insider.showNativeAppReview();
    console.log("[INSIDER][showNativeAppReview]: Method is triggered.");
  };

  const setCloseButtonLeft = () => {
    Insider.setInternalBrowserCloseButtonPosition(Insider.closeButtonPosition.LEFT);
    console.log("[INSIDER][setInternalBrowserCloseButtonPosition]: Method is triggered.");
  };

  return (
    <View>
      <View style={styles.row}>
        <CustomButton text="Remove In-App" onPress={removeInapp} />
        <CustomButton text="Show Native App Review" onPress={showNativeAppReview} />
      </View>
      {Platform.OS === "android" && (
        <CustomButton text="Close Button Left" onPress={setCloseButtonLeft} />
      )}
    </View>
  );
}

export default InAppMethods;
