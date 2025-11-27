import React from "react";
import { View } from "react-native";

import CustomButton from "../components/CustomButton";
import Insider from "react-native-insider";
import InsiderIdentifier from "react-native-insider/src/InsiderIdentifier"

const UserIdentifiers = () => {
  const login = () => {
    let currentUser = Insider.getCurrentUser();

    // Setting User Identifiers.
    let identifiers = new InsiderIdentifier();
    identifiers.addEmail("mobile.test@useinsider.com");
    identifiers.addPhoneNumber("+909876543210");
    identifiers.addUserID("{crmID}");

    currentUser.login(identifiers);

    console.log("[INSIDER][login]: ", identifiers);
  };

  const logout = () => {
    let currentUser = Insider.getCurrentUser();
    currentUser.logout();
    console.log("[INSIDER][logout]: Method is triggered.");
  };

  const signUp = () => {
    Insider.signUpConfirmation();
    console.log("[INSIDER][signUpConfirmation]: Method is triggered.");
  };

  return (
    <View>
      <CustomButton text="Login" onPress={login} />
      <CustomButton
        text="Logout"
        buttonStyle={{ backgroundColor: "#E57F74" }}
        onPress={logout}
      />
      <CustomButton
        text="Sign Up"
        buttonStyle={{ backgroundColor: "#007BFF" }}
        onPress={signUp}
      />
    </View>
  );
};

export default UserIdentifiers;
