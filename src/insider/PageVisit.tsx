import React from "react";
import { View, StyleSheet } from "react-native";

import CustomButton from "../components/CustomButton";
import Insider from "react-native-insider";

function PageVisitMethods() {
  const taxonomy = ["taxonomy1", "taxonomy2", "taxonomy3"];
  const insiderExampleProduct = Insider.createNewProduct(
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

  const triggerPage = (methodName: string) => {
    switch (methodName) {
      case "visitHomePage":
        Insider.visitHomePage();
        break;
      case "visitListingPage":
        Insider.visitListingPage(taxonomy);
        break;
      case "visitCartPage":
        const insiderExampleProducts = [
          insiderExampleProduct,
          insiderExampleProduct,
        ];
        Insider.visitCartPage(insiderExampleProducts);
        break;
      case "visitProductDetailPage":
        Insider.visitProductDetailPage(insiderExampleProduct);
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
            triggerPage("visitProductDetailPage");
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
            triggerPage("visitListingPage");
          }}
        />
      </View>
    </View>
  );
}

export default PageVisitMethods;
