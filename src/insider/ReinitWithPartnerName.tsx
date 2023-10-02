import React, { useState } from "react";
import { View, AsyncStorage } from "react-native";

import CustomButton from "../components/CustomButton";
import RNInsider from "react-native-insider";

const ReinitWithPartnerName = () => {
  setNewPartner = async () => {
    // --- REINIT --- //
    val newPartnerName = "new_partner_name";

    RNInsider.reinitWithPartnerName(newPartnerName);

    AsyncStorage.setItem(newPartnerName);

    console.log("[INSIDER][reinitWithPartnerName]: Method is triggered.");
  };

  return (
    <View>
      <CustomButton text="Set New Partner Name" onPress={setNewPartner} />
    </View>
  );
};

export default ReinitWithPartnerName;
