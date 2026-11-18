import React from "react";
import { View, StyleSheet } from "react-native";

import CustomButton from "../components/CustomButton";
import Insider from "react-native-insider";

function Purchase() {
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
  let insiderExampleProduct = Insider.createNewProduct(
    "productID",
    "productName",
    taxonomy,
    "imageURL",
    1000.5,
    "currency"
  );

  const itemPurchased = () => {
    const uniqueSaleID = 'uniqueSaleID';

    Insider.itemPurchased(uniqueSaleID, insiderExampleProduct);

    console.log("[INSIDER][itemPurchased]: Method is triggered.");
    console.log("[INSIDER][itemPurchased][uniqueSaleID]: " + uniqueSaleID);
  };

  const itemAddedToCart = () => {
    Insider.itemAddedToCart(insiderExampleProduct);

    console.log("[INSIDER][itemAddedToCart]: Method is triggered.");
    console.log("[INSIDER][itemAddedToCart][productSummary]: ", insiderExampleProduct);
  };

  const itemRemovedFromCart = () => {
    const productID = 'productID';

    Insider.itemRemovedFromCart(productID);

    console.log("[INSIDER][itemRemovedFromCart]: Method is triggered.");
    console.log("[INSIDER][itemRemovedFromCart][productID]: " + productID);
  };

  const cartCleared = () => {
    Insider.cartCleared();

    console.log("[INSIDER][cartCleared]: Method is triggered.");
  };

  const itemAddedToWishlist = () => {
    Insider.itemAddedToWishlist(insiderExampleProduct);

    console.log("[INSIDER][itemAddedToWishlist]: Method is triggered.");
  };

  const itemRemovedFromWishlist = () => {
    Insider.itemRemovedFromWishlist("productID");

    console.log("[INSIDER][itemRemovedFromWishlist]: Method is triggered.");
  };

  const wishlistCleared = () => {
    Insider.wishlistCleared();

    console.log("[INSIDER][wishlistCleared]: Method is triggered.");
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

      <View style={styles.row}>
        <CustomButton text="Item Add To Wishlist" onPress={itemAddedToWishlist} />
        <CustomButton text="Item Remove From Wishlist" onPress={itemRemovedFromWishlist} />
      </View>

      <View style={styles.row}>
        <CustomButton text="Wishlist Clear" onPress={wishlistCleared} />
      </View>
    </View>
  );
}

export default Purchase;
