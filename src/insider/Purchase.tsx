import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import CustomButton from "../components/CustomButton";
import RNInsider from "react-native-insider";

function Purchase(): JSX.Element {
  const styles = StyleSheet.create({
    row: {
      width: "100%",
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  // --- REVENUE TRACKING --- //

  const taxonomy = ["taxonomy1", "taxonomy2", "taxonomy3"];
  let insiderExampleProduct = RNInsider.createNewProduct(
    "productID",
    "productName",
    taxonomy,
    "imageURL",
    1000.5,
    "currency"
  );

  const itemPurchased = () => {
    const uniqueSaleID = 'uniqueSaleID';

    RNInsider.itemPurchased(uniqueSaleID, insiderExampleProduct);

    console.log("[INSIDER][itemPurchased]: Method is triggered.");
    console.log("[INSIDER][itemPurchased][uniqueSaleID]: " + uniqueSaleID);
  };

  const itemAddedToCart = () => {
    RNInsider.itemAddedToCart(insiderExampleProduct);

    console.log("[INSIDER][itemAddedToCart]: Method is triggered.");
    console.log("[INSIDER][itemAddedToCart][productSummary]: ", insiderExampleProduct);
  };

  const itemRemovedFromCart = () => {
    const productID = 'productID';

    RNInsider.itemRemovedFromCart(productID);

    console.log("[INSIDER][itemRemovedFromCart]: Method is triggered.");
    console.log("[INSIDER][itemRemovedFromCart][productID]: " + productID);
  };

  const cartCleared = () => {
    RNInsider.cartCleared();

    console.log("[INSIDER][cartCleared]: Method is triggered.");
  };

  return (
    <View>
      <View style={styles.row}>
        <CustomButton text="Item Add To Cart" onPress={itemAddedToCart} />
        <CustomButton text="Item Remove From Cart" onPress={itemRemovedFromCart} />
      </View>

      <View style={styles.row}>
        <CustomButton text="Item Purchase" onPress={itemPurchased} />
        <CustomButton text="Cart Clear" onPress={cartCleared} />
      </View>
    </View>
  );
}

export default Purchase;
