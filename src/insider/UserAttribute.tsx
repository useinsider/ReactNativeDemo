import React, { useState } from "react";
import { View } from "react-native";

import CustomButton from "../components/CustomButton";
import RNInsider from "react-native-insider";
import InsiderGender from 'react-native-insider/src/InsiderGender';

const UserAttributes = () => {
  setUserAttributes = () => {
    // --- USER --- //

    // You can crete Insider User and add attributes later on it.
    let currentUser = RNInsider.getCurrentUser();

    // Setting User Attributes in chainable way.
    currentUser
      .setName("Insider")
      .setSurname("Demo")
      .setAge(23)
      .setGender(InsiderGender.Other)
      .setBirthday(new Date())
      .setEmailOptin(true)
      .setSMSOptin(false)
      .setPushOptin(true)
      .setLocationOptin(true)
      .setFacebookID("Facebook-ID")
      .setTwitterID("Twittter-ID")
      .setLanguage("TR")
      .setLocale("tr_TR");

    console.log("[INSIDER][getCurrentUser]: Method is triggered.");
  };

  return (
    <View>
      <CustomButton text="Set Attribute" onPress={setUserAttributes} />
    </View>
  );
};

export default UserAttributes;
