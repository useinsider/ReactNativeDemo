import React from "react";
import { View } from "react-native";

import CustomButton from "../components/CustomButton";
import Insider from "react-native-insider";

function MessageCenter() {
  const triggerMessageCenter = () => {
    // --- MESSAGE CENTER --- //

    // You can see push campaigns in the last 90 days
    const startDate = new Date(Date.now() - 86400000);
    const endDate = new Date(Date.now() + 86400000);

    console.log("[INSIDER][getMessageCenterData]: Method is triggered , waiting response.");

    Insider.getMessageCenterData(
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
