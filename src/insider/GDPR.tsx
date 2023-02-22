import React from "react";
import { View, StyleSheet } from "react-native";

import CustomButton from "../components/CustomButton";
import RNInsider from "react-native-insider";

function GDPRMethods(): JSX.Element {
  const styles = StyleSheet.create({
    row: {
      width: "100%",
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  // --- GDPR --- //

  const setGDPR = (gdprStatus) => {
    RNInsider.setGDPRConsent(gdprStatus);

    console.log("INSIDER GDPR Status: " + gdprStatus);
  };

  return (
    <View style={styles.row}>
      <CustomButton
        text="GDPR True"
        onPress={() => {
          setGDPR(true);
        }}
      />
      <CustomButton
        text="GDPR False"
        onPress={() => {
          setGDPR(false);
        }}
      />
    </View>
  );
}

export default GDPRMethods;
