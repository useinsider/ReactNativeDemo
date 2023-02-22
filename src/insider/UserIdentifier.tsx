import React, { useState } from "react";
import { View } from "react-native";

import CustomButton from "../components/CustomButton";
import RNInsider from "react-native-insider";
import RNInsiderIdentifier from 'react-native-insider/src/InsiderIdentifier';

const UserIdentifiers = () => {
  const login = () => {
    let currentUser = RNInsider.getCurrentUser();

    // Setting User Identifiers.
    let identifiers = new RNInsiderIdentifier();
    identifiers.addEmail("mobile.test@useinsider.com");
    identifiers.addPhoneNumber("+909876543210");
    identifiers.addUserID("{crmID}");

    currentUser.login(identifiers);

    console.log("[INSIDER][login]: ", identifiers);
  };

  const logout = () => {
    let currentUser = RNInsider.getCurrentUser();

    currentUser.logout();

    console.log("[INSIDER][logout]: Method is triggered.");
  };

  return (
    <View>
      <CustomButton text="Login" onPress={login} />
      <CustomButton
        text="Logout"
        buttonStyle={{ backgroundColor: "#E57F74" }}
        onPress={logout}
      />
    </View>
  );
};

export default UserIdentifiers;
