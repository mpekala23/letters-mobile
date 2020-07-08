import React from 'react';
import { View, Text } from 'react-native';
import i18n from '@i18n';
import { AuthStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';

type PrivacyScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Privacy'
>;

interface Props {
  navigation: PrivacyScreenNavigationProp;
}
const PrivacyScreen: React.FC<Props> = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <Text>Hello world</Text>
    </View>
  );
};

export default PrivacyScreen;
