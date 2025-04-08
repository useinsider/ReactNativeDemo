import React, {useState} from 'react';
import {View} from 'react-native';

import CustomButton from '../components/CustomButton';

import RNInsider from 'react-native-insider';
import ContentOptimizerDataType from 'react-native-insider/src/ContentOptimizerDataType';

function ContentOptimizer() {
  const triggerContentOptimizer = () => {
    // --- CONTENT OPTIMIZER --- //

    // // String
    // RNInsider.getContentStringWithName(
    //   'string_variable_name',
    //   'defaultValue', // Default Value
    //   ContentOptimizerDataType.Element,
    //   value => console.log('[INSIDER][getContentStringWithName]: ', value),
    // );
    //
    // // Boolean
    // RNInsider.getContentBoolWithName(
    //   'bool_variable_name',
    //   true, // Default Value
    //   ContentOptimizerDataType.Element,
    //   value => console.log('[INSIDER][getContentBoolWithName]: ', value),
    // );
    //
    // // Integer
    // RNInsider.getContentIntWithName(
    //   'int_variable_name',
    //   10, // Default Value
    //   ContentOptimizerDataType.Element,
    //   value => console.log('[INSIDER][getContentIntWithName]: ', value),
    // );

    // String Without Cache
    RNInsider.getContentStringWithoutCache(
      'humeyra',
      'defaultValue', // Default Value
      ContentOptimizerDataType.Content,
      value => console.log('[INSIDER][getContentStringWithoutCache]: ', value),
    );

    // Boolean Without Cache
    RNInsider.getContentBoolWithoutCache(
      'soner_test2',
      true, // Default Value
      ContentOptimizerDataType.Content,
      value => console.log('[INSIDER][getContentBoolWithoutCache]: ', value),
    );

    // Integer Without Cache
    RNInsider.getContentIntWithoutCache(
      'intGet',
      250, // Default Value
      ContentOptimizerDataType.Element,
      value => console.log('[INSIDER][getContentIntWithoutCache]: ', value),
    );
  };

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
