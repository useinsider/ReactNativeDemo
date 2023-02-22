import React, { useState } from "react";
import { View } from "react-native";

import CustomButton from "../components/CustomButton";

import RNInsider from "react-native-insider";
 import ContentOptimizerDataType from 'react-native-insider/src/ContentOptimizerDataType';

function ContentOptimizer(): JSX.Element {
  const triggerContentOptimizer = () => {
     // --- CONTENT OPTIMIZER --- //

     // String
     const contentOptimizerString = RNInsider.getContentStringWithName(
       'string_variable_name',
       'defaultValue', // Default Value
       ContentOptimizerDataType.Element,
       (contentOptimizerString) => {
         console.log('[INSIDER][getContentStringWithName]: ', contentOptimizerString);
       }
     );

     // Boolean
     const contentOptimizerBool = RNInsider.getContentBoolWithName(
       'bool_variable_name',
       true, // Default Value
       ContentOptimizerDataType.Element,
       (contentOptimizerBoolean) => {
         console.log('[INSIDER][getContentBoolWithName]: ', contentOptimizerBoolean);
       }
     );

     // Integer
     const contentOptimizerInt = RNInsider.getContentIntWithName(
       'int_variable_name',
       10, // Default Value
       ContentOptimizerDataType.Element,
       (contentOptimizerInt) => {
         console.log('[INSIDER][getContentIntWithName]: ', contentOptimizerInt);
       }
     );
  }

  return (
    <View>
      <CustomButton
        text="Get Variable With Content Optimizer"
        onPress={triggerContentOptimizer}
      />
    </View>
  );
}

export default ContentOptimizer;
