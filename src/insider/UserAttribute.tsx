import React from "react";
import { View, StyleSheet } from "react-native";

import CustomButton from "../components/CustomButton";
import Insider from "react-native-insider";
import InsiderGender from "react-native-insider/src/InsiderGender";

const OBJECTS_KEY = "objects_parameter";

const UserAttributes = () => {
  const styles = StyleSheet.create({
    row: {
      width: "100%",
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });

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
      .setEmail("mobile.test@useinsider.com")
      .setPhoneNumber("+909876543210")
      .setEmailOptin(true)
      .setSMSOptin(false)
      .setPushOptin(true)
      .setLocationOptin(true)
      .setWhatsappOptin(true)
      .setPromotionalOptin(true)
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

  // --- CUSTOM ATTRIBUTE OBJECTS --- //

  const addObjects = () => {
    Insider.getCurrentUser().addObjectsToCustomAttribute(OBJECTS_KEY, [
      { id: "item1", qty: 1 },
      { id: "item2", qty: 2 },
    ]);
    console.log("[INSIDER][addObjectsToCustomAttribute]: Method is triggered.");
  };

  const mergeObjects = () => {
    Insider.getCurrentUser().mergeObjectsInCustomAttribute(OBJECTS_KEY, { id: "item1" }, { qty: 5 });
    console.log("[INSIDER][mergeObjectsInCustomAttribute]: Method is triggered.");
  };

  const removeObjects = () => {
    Insider.getCurrentUser().removeObjectsFromCustomAttribute(OBJECTS_KEY, { id: "item2" });
    console.log("[INSIDER][removeObjectsFromCustomAttribute]: Method is triggered.");
  };

  const unsetAttribute = () => {
    Insider.getCurrentUser().unsetCustomAttribute(OBJECTS_KEY);
    console.log("[INSIDER][unsetCustomAttribute]: Method is triggered.");
  };

  return (
    <View>
      <CustomButton text="Set Attribute" onPress={setUserAttributes} />
      <View style={styles.row}>
        <CustomButton text="Add Objects" onPress={addObjects} />
        <CustomButton text="Merge Objects" onPress={mergeObjects} />
      </View>
      <View style={styles.row}>
        <CustomButton text="Remove Objects" onPress={removeObjects} />
        <CustomButton text="Unset Attribute" onPress={unsetAttribute} />
      </View>
    </View>
  );
};

export default UserAttributes;
