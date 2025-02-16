import React, { useState } from "react";
import { View } from "react-native";

import CustomButton from "../components/CustomButton";
import RNInsider from "react-native-insider";

function Product(): JSX.Element {
  const createProduct = () => {
    const arr = ['value1', 'value2', 'value3'];
    const taxonomy = ["taxonomy1", "taxonomy2", "taxonomy3"];
    let insiderExampleProduct = RNInsider.createNewProduct(
      "productID",
      "productName",
      taxonomy,
      "imageURL",
      1000.5,
      "currency"
    );

    // Setting Product Attributes in chainable way.
    insiderExampleProduct
      .setColor("color")
      .setVoucherName("voucherName")
      .setVoucherDiscount(10.5)
      .setPromotionName("promotionName")
      .setPromotionDiscount(10.5)
      .setSize("size")
      .setSalePrice(10.5)
      .setShippingCost(10.5)
      .setQuantity(10)
      .setStock(10)
      .setGroupCode("12345");

    // Setting custom attributes.
    // MARK: Your attribute key should be all lowercased and should not include any special or non Latin characters or any space, otherwise this attribute will be ignored. You can use underscore _.
    insiderExampleProduct
      .setCustomAttributeWithString("string_parameter", "This is Insider.")
      .setCustomAttributeWithInt("int_parameter", 10)
      .setCustomAttributeWithDouble("double_parameter", 10.5)
      .setCustomAttributeWithBoolean("bool_parameter", true)
      .setCustomAttributeWithDate("date_parameter", new Date());

    // MARK: You can only call the method with array of string otherwise this event will be ignored.
    insiderExampleProduct.setCustomAttributeWithArray("array_parameter", arr);

    console.log("[INSIDER][createNewProduct]: ", insiderExampleProduct);
  };

  return (
    <View>
      <CustomButton text="Create Product" onPress={createProduct} />
    </View>
  );
}

export default Product;
