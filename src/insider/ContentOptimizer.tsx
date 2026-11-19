import React from 'react';
import {View} from 'react-native';

import CustomButton from '../components/CustomButton';

import Insider from 'react-native-insider';
import InsiderContentOptimizerDataType from 'react-native-insider/src/ContentOptimizerDataType';

function ContentOptimizer() {
  const triggerContentOptimizer = () => {
    // --- CONTENT OPTIMIZER --- //

    // String
    Insider.getContentStringWithName(
      'string_variable_name',
      'defaultValue', // Default Value
      InsiderContentOptimizerDataType.Element,
      value => console.log('[INSIDER][getContentStringWithName]: ', value),
    );

    // // Boolean
    Insider.getContentBoolWithName(
      'bool_variable_name',
      true, // Default Value
      InsiderContentOptimizerDataType.Element,
      value => console.log('[INSIDER][getContentBoolWithName]: ', value),
    );

    // // Integer
    Insider.getContentIntWithName(
      'int_variable_name',
      10, // Default Value
      InsiderContentOptimizerDataType.Element,
      value => console.log('[INSIDER][getContentIntWithName]: ', value),
    );

    // String Without Cache
    Insider.getContentStringWithoutCache(
      'string_variable_name',
      'defaultValue', // Default Value
      InsiderContentOptimizerDataType.Element,
      value => console.log('[INSIDER][getContentStringWithoutCache]: ', value),
    );

    // Boolean Without Cache
    Insider.getContentBoolWithoutCache(
      'bool_variable_name',
      true, // Default Value
      InsiderContentOptimizerDataType.Element,
      value => console.log('[INSIDER][getContentBoolWithoutCache]: ', value),
    );

    // Integer Without Cache
    Insider.getContentIntWithoutCache(
      'int_variable_name',
      10, // Default Value
      InsiderContentOptimizerDataType.Element,
      value => console.log('[INSIDER][getContentIntWithoutCache]: ', value),
    );
  };

  const markContentAsSeen = () => {
    Insider.markContentOptimizerAsSeen('string_variable_name');
    console.log('[INSIDER][markContentOptimizerAsSeen]: Method is triggered.');
  };

  return (
    <View>
      <CustomButton
        text="Get Variable With Content Optimizer"
        onPress={triggerContentOptimizer}
      />
      <CustomButton text="Mark Content As Seen" onPress={markContentAsSeen} />
    </View>
  );
}

export default ContentOptimizer;
