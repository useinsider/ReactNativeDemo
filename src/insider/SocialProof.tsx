import React, { useState } from "react";
import { View } from "react-native";

import CustomButton from "../components/CustomButton";
import RNInsider from "react-native-insider";

function SocialProof(): JSX.Element {
  const taxonomy = ["taxonomy1", "taxonomy2", "taxonomy3"];
  let insiderExampleProduct = RNInsider.createNewProduct(
    "productID",
    "productName",
    taxonomy,
    "imageURL",
    1000.5,
    "currency"
  );

  const triggerSocialProof = () => {
    RNInsider.visitProductDetailPage(insiderExampleProduct);

    console.log("[INSIDER][visitProductDetailPage]: Method is triggered.");
  };

  return (
    <View>
      <CustomButton text="Trigger Social Proof" onPress={triggerSocialProof} />
    </View>
  );
}

export default SocialProof;
