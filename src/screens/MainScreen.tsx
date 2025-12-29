import React from 'react';
import { ScrollView, Text, useColorScheme, View } from 'react-native';

import Header from '../components/Header.tsx';
import CustomSection from '../components/CustomSection.tsx';

import UserAttribute from '../insider/UserAttribute.tsx';
import UserIdentifier from '../insider/UserIdentifier.tsx';
import Event from '../insider/Event.tsx';
import Product from '../insider/Product.tsx';
import Purchase from '../insider/Purchase.tsx';
import SmartRecommender from '../insider/SmartRecommender.tsx';
import SocialProof from '../insider/SocialProof.tsx';
import PageVisit from '../insider/PageVisit.tsx';
import GDPR from '../insider/GDPR.tsx';
import MobileAppAccess from '../insider/MobileAppAccess.tsx';
import MessageCenter from '../insider/MessageCenter.tsx';
import ContentOptimizer from '../insider/ContentOptimizer.tsx';
import ReinitWithPartnerName from '../insider/ReinitWithPartnerName.tsx';
import BlockInApps from '../insider/BlockInApps.tsx';

function MainScreen() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
      <Header />
      <View style={{ backgroundColor: isDarkMode ? '#000' : '#fff' }}>
        <Text style={{ fontSize: 18, marginVertical: 18, marginHorizontal: 24 }}>
          This Demo contains simple methods that you can use with the Insider SDK.
        </Text>

        <CustomSection title="Reinit With Partner Name">
          <ReinitWithPartnerName />
        </CustomSection>

        <CustomSection title="User Attributes">
          <UserAttribute />
        </CustomSection>

        <CustomSection title="User Identifiers">
          <UserIdentifier />
        </CustomSection>

        <CustomSection title="Event">
          <Event />
        </CustomSection>

        <CustomSection title="Product">
          <Product />
        </CustomSection>

        <CustomSection title="Purchase">
          <Purchase />
        </CustomSection>

        <CustomSection title="Smart Recommender">
          <SmartRecommender />
        </CustomSection>

        <CustomSection title="Social Proof">
          <SocialProof />
        </CustomSection>

        <CustomSection title="Page Visit Methods">
          <PageVisit />
        </CustomSection>

        <CustomSection title="GDPR">
          <GDPR />
        </CustomSection>

        <CustomSection title="Mobile App Access">
          <MobileAppAccess />
        </CustomSection>

        <CustomSection title="Message Center">
          <MessageCenter />
        </CustomSection>

        <CustomSection title="Content Optimizer">
          <ContentOptimizer />
        </CustomSection>

        <CustomSection title="Block In App">
          <BlockInApps />
        </CustomSection>
      </View>
    </ScrollView>
  );
}

export default MainScreen;
