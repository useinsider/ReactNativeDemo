import React from "react";
import { View, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton";
import RNInsider from "react-native-insider";

function ReInitSDK(): JSX.Element {
  const reInitSDK = () => {
    console.log("[INSIDER][reInitSDK]: Button Pressed");

    try {
      RNInsider.reinitWithPartnerName("test_partner");
      console.log("[INSIDER][reInitSDK]: Reinitialized with test_partner");
    } catch (error) {
      console.error("[INSIDER][reInitSDK]: Error reinitializing SDK", error);
    }
  };

  return (
    <View>
      <CustomButton text="Re Init SDK" onPress={reInitSDK}/>
    </View>
  );
}

export default ReInitSDK;
