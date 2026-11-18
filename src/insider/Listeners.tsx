import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";

import CustomButton from "../components/CustomButton";
import Insider, { InsiderEventSubscription } from "react-native-insider";

function Listeners() {
  const styles = StyleSheet.create({
    row: {
      width: "100%",
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  const subscription = useRef<InsiderEventSubscription | undefined>(undefined);
  // The SDK adds a JS listener on every insiderIDListener call and never removes it.
  const insiderIDListenerRegistered = useRef(false);

  useEffect(() => {
    return () => {
      subscription.current?.remove();
      subscription.current = undefined;
    };
  }, []);

  const listenInsiderID = () => {
    if (insiderIDListenerRegistered.current) {
      return;
    }
    insiderIDListenerRegistered.current = true;
    Insider.insiderIDListener((insiderID) => {
      console.log("[INSIDER][insiderIDListener]: " + insiderID);
    });
    console.log("[INSIDER][insiderIDListener]: Method is triggered.");
  };

  const addEventObserver = () => {
    if (subscription.current) {
      return;
    }
    subscription.current = Insider.events.addObserver((name, parameters, timestamp) => {
      console.log("[INSIDER][eventRecorded]: " + name, parameters, timestamp);
    });
    console.log("[INSIDER][addObserver]: Method is triggered.");
  };

  const removeEventObserver = () => {
    if (!subscription.current) {
      return;
    }
    subscription.current.remove();
    subscription.current = undefined;
    console.log("[INSIDER][removeObserver]: Method is triggered.");
  };

  return (
    <View>
      <CustomButton text="Insider ID Listener" onPress={listenInsiderID} />
      <View style={styles.row}>
        <CustomButton text="Add Event Observer" onPress={addEventObserver} />
        <CustomButton text="Remove Event Observer" onPress={removeEventObserver} />
      </View>
    </View>
  );
}

export default Listeners;
