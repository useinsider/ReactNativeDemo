import React, { useState } from "react";
import { View } from "react-native";

import CustomButton from "../components/CustomButton";
import Insider from "react-native-insider";

function SocialProof() {
  const taxonomy = ["taxonomy1", "taxonomy2", "taxonomy3"];
  let insiderExampleProduct = Insider.createNewProduct(
    "productID",
    "productName",
    taxonomy,
    "imageURL",
    1000.5,
    "currency"
  );

  const triggerSocialProof = () => {
    Insider.visitProductDetailPage(insiderExampleProduct);

    console.log("[INSIDER][visitProductDetailPage]: Method is triggered.");
  };

  return (
    <View>
      <CustomButton text="Trigger Social Proof" onPress={triggerSocialProof} />
    </View>
  );
}

export default SocialProof;
