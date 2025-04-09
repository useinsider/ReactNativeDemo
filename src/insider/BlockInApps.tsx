import React from "react";
import { View, StyleSheet } from "react-native";

import CustomButton from "../components/CustomButton";
import Insider from "react-native-insider";

function BlockInApps() {
  const styles = StyleSheet.create({
    row: {
      width: "100%",
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  const disableInAppMessages = () => {
    Insider.disableInAppMessages();
    console.log("[INSIDER][disableInAppMessages]: Method is triggered.");
  };

  const enableInAppMessages = () => {
    Insider.enableInAppMessages();
    console.log("[INSIDER][enableInAppMessages]: Method is triggered.");
  };

  return (
    <View>
      <View style={styles.row}>
        <CustomButton text="Disable In-App Messages" onPress={disableInAppMessages} />
        <CustomButton text="Enable In-App Messages" onPress={enableInAppMessages} />
      </View>
    </View>
  );
}

export default BlockInApps;
