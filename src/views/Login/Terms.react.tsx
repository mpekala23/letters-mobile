import React from 'react';
import { View, Text } from 'react-native';
import i18n from '@i18n';
import { AuthStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';

type TermsScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Terms'
>;

interface Props {
  navigation: TermsScreenNavigationProp;
}
const TermsScreen: React.FC<Props> = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: 'white',
      }}
    >
      <Text>
        Introduction. To assist you in using our Services, and to ensure a clear
        understanding of the relationship from your use of the Services, we have
        created these Terms of Services (the “Terms”). The Terms constitute a
        binding agreement between you and Ameelio. The Terms govern your use of
        the Services and any other services offered as part of the Ameelio
        platform. The Terms also governs any information, text, graphics,
        photos, recordings, or other materials uploaded, downloaded, or
        appearing on the Services (collectively referred to as “Content”).
      </Text>
    </View>
  );
};

export default TermsScreen;
