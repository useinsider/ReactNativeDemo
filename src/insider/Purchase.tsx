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

  const taxonomy = ["Clothing", "Footwear", "Sneakers"];
  let insiderExampleProduct = Insider.createNewProduct(
    '0dffbd14-9416-4de0-a57c-2aee3cca1837',
    'Running Sneakers',
    taxonomy,
    'https://insiderone.com/image_url/2aee3cca1837',
    499.99,
    'TRY',
  );

  insiderExampleProduct
    .setColor('Red')
    .setVoucherName('Voucher Name')
    .setPromotionName('Promotion Name')
    .setSize('45')
    .setSalePrice(449.99)
    .setShippingCost(9.99)
    .setVoucherDiscount(50)
    .setPromotionDiscount(0)
    .setStock(20)
    .setQuantity(1)
    .setGroupCode('Group Code')
    .setBrand('Nike')
    .setSku('sneaker-1234')
    .setGender('male')
    .setMultipack('No')
    .setProductType('consumable')
    .setGtin('Gtin')
    .setDescription('Product Description')
    .setTags(['cool', 'summer', 'waterproof'])
    .setInStock(true)
    .setProductURL('https://insiderone.com/product_url/2aee3cca1837');

  insiderExampleProduct
    .setCustomAttributeWithString('parameter_string', 'This is Insider.')
    .setCustomAttributeWithInt('parameter_int', 55)
    .setCustomAttributeWithDouble('parameter_double', 3.14)
    .setCustomAttributeWithBoolean('parameter_boolean', true)
    .setCustomAttributeWithDate('heysem', new Date('2025-11-17T03:00:00.000Z'));

  insiderExampleProduct
    .setCustomAttributeWithArray('parameter_string_array_1', ['value1', 'value2'])
    .setCustomAttributeWithStringArray('parameter_string_array_2', ['value1', 'value2'])
    .setCustomAttributeWithNumericArray('parameter_numeric_array', [10, 3.14, 100]);

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

    console.log('[INSIDER][itemAddedToWishlist]: Method is triggered.');
    console.log(
      '[INSIDER][itemAddedToWishlist][productSummary]: ',
      insiderExampleProduct,
    );
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
      </View>
    </View>
  );
}

export default Purchase;
