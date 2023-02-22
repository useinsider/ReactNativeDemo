import React from "react";
import { View, StyleSheet } from "react-native";

import CustomButton from "../components/CustomButton";
import RNInsider from "react-native-insider";

function PageVisitMethods(): JSX.Element {
  const taxonomy = ["taxonomy1", "taxonomy2", "taxonomy3"];
  const insiderExampleProduct = RNInsider.createNewProduct(
    "productID",
    "productName",
    taxonomy,
    "imageURL",
    1000.5,
    "currency"
  );

  const styles = StyleSheet.create({
    row: {
      width: "100%",
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  // --- PAGE VISIT METHODS --- //

  const triggerPage = (methodName) => {
    switch (methodName) {
      case "visitHomePage":
        RNInsider.visitHomePage();
        break;
      case "visitListingPage":
        RNInsider.visitListingPage(taxonomy);
        break;
      case "visitCartPage":
        const insiderExampleProducts = [
          insiderExampleProduct,
          insiderExampleProduct,
        ];
        RNInsider.visitCartPage(insiderExampleProducts);
        break;
      case "visitProductDetailPage":
        RNInsider.visitProductDetailPage(insiderExampleProduct);
        break;
    }

    console.log("[INSIDER][" + methodName + "]: Method is triggered.");
  };

  return (
    <View>
      <View style={styles.row}>
        <CustomButton
          text="Home Page"
          onPress={() => {
            triggerPage("visitHomePage");
          }}
        />
        <CustomButton
          text="Product Page"
          onPress={() => {
            triggerPage("visitListingPage");
          }}
        />
      </View>
      <View style={styles.row}>
        <CustomButton
          text="Cart Page"
          onPress={() => {
            triggerPage("visitCartPage");
          }}
        />
        <CustomButton
          text="Category Page"
          onPress={() => {
            triggerPage("visitProductDetailPage");
          }}
        />
      </View>
    </View>
  );
}

export default PageVisitMethods;
