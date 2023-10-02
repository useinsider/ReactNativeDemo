import React, { useState } from "react";
import { View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomButton from "../components/CustomButton";
import RNInsider from "react-native-insider";

const ReinitWithPartnerName = () => {
  setNewPartner = async () => {
    // --- REINIT --- //
    let newPartnerName = "your_partner_name";

    RNInsider.reinitWithPartnerName(newPartnerName);

    AsyncStorage.setItem("insider_partner_name", newPartnerName);

    console.log("[INSIDER][reinitWithPartnerName]: Method is triggered.");
  };

  return (
    <View>
      <CustomButton text="Set New Partner Name" onPress={setNewPartner} />
    </View>
  );
};

export default ReinitWithPartnerName;
