import React, { useState } from "react";
import { View } from "react-native";

import CustomButton from "../components/CustomButton";
import RNInsider from "react-native-insider";

function MessageCenter(): JSX.Element {
  const triggerMessageCenter = () => {
    // --- MESSAGE CENTER --- //

    // You can able to see push campaigns in the last 90 days
    const startDate = new Date(Date.now() - 86400000);
    const endDate = new Date(Date.now() + 86400000);

    console.log("[INSIDER][getMessageCenterData]: Method is triggered , waiting response.");

    RNInsider.getMessageCenterData(
      100, // Max Data Limit
      startDate,
      endDate,
      (messageCenterData) => {
        console.log("[INSIDER][getMessageCenterData]: ", messageCenterData);
      }
    );
  };

  return (
    <View>
      <CustomButton text="Get Message Center Data" onPress={triggerMessageCenter} />
    </View>
  );
}

export default MessageCenter;
