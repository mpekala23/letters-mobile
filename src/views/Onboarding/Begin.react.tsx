import React from 'react';
import { Text, View } from 'react-native';
import i18n from '@i18n';
import { Icon, Button } from '@components';
import LogoSmallGrey from '@assets/views/Onboarding/LogoSmallGrey';
import { Colors, Typography } from '@styles';
import { AuthStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import LovedOnes from '@assets/views/Onboarding/LovedOnes';
import Styles from './Begin.styles';

type BeginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Begin'
>;

interface Props {
  navigation: BeginScreenNavigationProp;
}

const BeginScreen: React.FC<Props> = (props: Props) => {
  return (
    <View accessible={false} style={Styles.trueBackground}>
      <View accessible accessibilityLabel="Ameelio Logo" style={Styles.header}>
        <Icon svg={LogoSmallGrey} />
      </View>
      <Text style={[Typography.FONT_BOLD, Styles.titleText, { marginTop: 40 }]}>
        {i18n.t('BeginScreen.connectWithYourLovedOnes')}
      </Text>
      <View style={{ paddingBottom: 80, paddingTop: 18 }}>
        <Icon svg={LovedOnes} />
      </View>
      <View style={{ position: 'absolute', bottom: 24, width: '100%' }}>
        <Button
          onPress={() => props.navigation.navigate('Register')}
          buttonText={i18n.t('BeginScreen.signUp')}
          textStyle={[Typography.FONT_BOLD, Styles.baseText]}
          containerStyle={{ height: 47 }}
        />
        <Button
          onPress={() => props.navigation.navigate('Login')}
          buttonText={i18n.t('BeginScreen.logIn')}
          reverse
          textStyle={
            (Typography.FONT_BOLD, Styles.baseText, { color: Colors.PINK_500 })
          }
          containerStyle={{ height: 47 }}
        />
      </View>
    </View>
  );
};

export default BeginScreen;
