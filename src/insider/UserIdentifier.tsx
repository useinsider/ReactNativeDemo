import React from "react";
import { View } from "react-native";

import CustomButton from "../components/CustomButton";
import Insider from "react-native-insider";
import InsiderIdentifier from "react-native-insider/src/InsiderIdentifier"
import { colors } from "../theme";

export const buildIdentifiers = () => {
  let identifiers = new InsiderIdentifier();
  identifiers.addEmail("mobile.test@useinsider.com");
  identifiers.addPhoneNumber("+909876543210");
  identifiers.addUserID("{crmID}");
  return identifiers;
};

const UserIdentifiers = () => {
  const login = () => {
    let currentUser = Insider.getCurrentUser();

    // Setting User Identifiers.
    let identifiers = buildIdentifiers();

    currentUser.login(identifiers);

    console.log("[INSIDER][login]: ", identifiers);
  };

  const loginWithReturningID = () => {
    Insider.getCurrentUser().login(buildIdentifiers(), (insiderID) => {
      console.log("[INSIDER][loginWithReturningID]: " + insiderID);
    });
  };

  const logout = () => {
    let currentUser = Insider.getCurrentUser();
    currentUser.logout();
    console.log("[INSIDER][logout]: Method is triggered.");
  };

  const logoutResettingInsiderID = () => {
    Insider.getCurrentUser().logoutResettingInsiderID(null, (insiderID) => {
      console.log("[INSIDER][logoutResettingInsiderID]: " + insiderID);
    });
  };

  const getInsiderID = async () => {
    try {
      const insiderID = await Insider.getInsiderID();
      console.log("[INSIDER][getInsiderID]: " + insiderID);
    } catch (err) {
      console.log("[INSIDER][getInsiderID]: failed: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const signUp = () => {
    Insider.signUpConfirmation();
    console.log("[INSIDER][signUpConfirmation]: Method is triggered.");
  };

  return (
    <View>
      <CustomButton text="Login" onPress={login} />
      <CustomButton text="Login With Returning ID" onPress={loginWithReturningID} />
      <CustomButton
        text="Logout"
        buttonStyle={{ backgroundColor: colors.orangeDark }}
        onPress={logout}
      />
      <CustomButton
        text="Logout Resetting ID"
        buttonStyle={{ backgroundColor: colors.orangeDark }}
        onPress={logoutResettingInsiderID}
      />
      <CustomButton text="Get Insider ID" onPress={getInsiderID} />
      <CustomButton
        text="Sign Up"
        buttonStyle={{ backgroundColor: colors.navy }}
        onPress={signUp}
      />
    </View>
  );
};

export default UserIdentifiers;
