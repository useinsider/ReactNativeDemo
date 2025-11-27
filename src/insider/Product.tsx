import React from "react";
import { View } from "react-native";

import CustomButton from "../components/CustomButton";
import Insider from "react-native-insider";

function Product() {
  const createProduct = () => {
  const numberArray: number[] = [10, 20, 30];
  const stringArray: string[] = ["hello world", "selam"];
Insider.tagEvent("custom_event")
    .addParameterWithDouble("double_key", 10)
    .addParameterWithInt("integer_key", 20)
    .addParameterWithBoolean("boolean_key", true)
    .addParameterWithString("string_key", "string")
    .addParameterWithNumericArray("numeric_array_key", numberArray)
    .addParameterWithStringArray("string_array_key", stringArray)
    .addParameterWithDate("date_key", new Date(2025, 7, 26))
    .build();
const insiderProduct = Insider.createNewProduct("ProductID", "Product Name", ["category1", "category2"], "https://localhost", 10, "TRY");
insiderProduct
    .setCustomAttributeWithString("string_parameter", "This is Insider.")
    .setCustomAttributeWithInt("int_parameter", 10)
    .setCustomAttributeWithDouble("double_parameter", 10.5)
    .setCustomAttributeWithBoolean("bool_parameter", true)
    .setCustomAttributeWithDate("date_parameter", new Date())
    .setCustomAttributeWithStringArray("string_array_parameter", stringArray)
    .setCustomAttributeWithNumericArray("numeric_array_parameter", numberArray)

Insider.itemPurchased("saleID", insiderProduct);
console.log("[INSIDER] Event sent", insiderProduct);
};

  return (
    <View>
      <CustomButton text="Create Product" onPress={createProduct} />
    </View>
  );
}

export default Product;
