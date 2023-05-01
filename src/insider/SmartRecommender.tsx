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

 const triggerSmartRecommenderPurchaseAndAddToCart = () => {
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

      RNInsider.clickSmartRecommendationProduct(1, insiderExampleProduct)

      console.log("[INSIDER][clickSmartRecommendationProduct]: Method is triggered.");

      RNInsider.itemAddedToCart(insiderExampleProduct);

      console.log("[INSIDER][itemAddedToCart]: Method is triggered.");

      let uniqueSaleID = "sale_id_" + Date.now();

      RNInsider.itemPurchased(uniqueSaleID, insiderExampleProduct);

      console.log("[INSIDER][itemPurchased]: Method is triggered. Sale ID: " + uniqueSaleID);
    });
  };

  return (
    <View>
      <CustomButton
        text="Get Smart Recommender Data"
        onPress={triggerSmartRecommender}
      />
      <CustomButton
        text="Trigger Add To Cart & Purchase"
        onPress={triggerSmartRecommenderPurchaseAndAddToCart}
      />
    </View>
  );
}

export default SmartRecommender;
