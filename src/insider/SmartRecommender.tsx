import React, { useState } from "react";
import { View } from "react-native";

import CustomButton from "../components/CustomButton";
import RNInsider from "react-native-insider";

function SmartRecommender(): JSX.Element {
  const triggerSmartRecommender = () => {
    // --- RECOMMENDATION ENGINE --- //
    const taxonomy = ["taxonomy1", "taxonomy2", "taxonomy3"];
    let insiderExampleProduct = RNInsider.createNewProduct(
      "productID",
      "productName",
      taxonomy,
      "imageURL",
      1000.5,
      "currency"
    );

    // ID comes from your smart recommendation campaign.
    // Please follow the language code structure. For instance en_US.

    console.log("[INSIDER][getSmartRecommendation]: Method is triggered , waiting response.");

    RNInsider.getSmartRecommendation(1, "tr_TR", "TRY", (recommendation) => {
      // Handle here
      console.log("[INSIDER][getSmartRecommendation]: ", recommendation);
    });

    console.log("[INSIDER][getSmartRecommendationWithProduct]: Method is triggered , waiting response.");

    RNInsider.getSmartRecommendationWithProduct(
      insiderExampleProduct,
      1, // Recommendation ID
      "tr_TR",
      (recommendation) => {
        // Handle here
        console.log(
          "[INSIDER][getSmartRecommendationWithProduct]: ",
          recommendation
        );
      }
    );

    console.log("[INSIDER][getSmartRecommendationWithProductIDs]: Method is triggered , waiting response.");

    RNInsider.getSmartRecommendationWithProductIDs(
      ["XX", "YY", "ZZ"], // Product IDs
      1, // Recommendation ID
      "en_US",
      "US",
      (recommendation) => {
        console.log("getSmartRecommendationWithProductIDs:", recommendation);
      }
    );
  };

  return (
    <View>
      <CustomButton
        text="Get Smart Recommender Data"
        onPress={triggerSmartRecommender}
      />
    </View>
  );
}

export default SmartRecommender;
