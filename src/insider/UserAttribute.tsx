import React from "react";
import { View } from "react-native";

import CustomButton from "../components/CustomButton";
import Insider from "react-native-insider";
import InsiderGender from "react-native-insider/src/InsiderGender";

const UserAttributes = () => {
  const setUserAttributes = () => {
    // --- USER --- //

    // You can crete Insider User and add attributes later on it.
    let currentUser = Insider.getCurrentUser();

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
      .setLocale("tr_TR")
      .setCustomAttributeWithString("string_parameter", "Insider Example")
      .setCustomAttributeWithInt("int_parameter", 10)
      .setCustomAttributeWithDouble("double_parameter", 10.5)
      .setCustomAttributeWithBoolean("bool_parameter", true)
      .setCustomAttributeWithDate("date_parameter", new Date())
      .setCustomAttributeWithArray("array_parameter", ["value1", "value2", "value3"]);

    console.log("[INSIDER][getCurrentUser]: Method is triggered.");
  };

  return (
    <View>
      <CustomButton text="Set Attribute" onPress={setUserAttributes} />
    </View>
  );
};

export default UserAttributes;
