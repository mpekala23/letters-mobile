import React from 'react';
import { Text, View, Image } from 'react-native';
import i18n from '@i18n';
import { Icon, Button } from '@components';
import AmeelioBirdBlue from '@assets/AmeelioBirdBlueSmall';
import { Colors, Typography } from '@styles';
import { AuthStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import People from '@assets/views/Onboarding/People.png';
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
        <Icon svg={AmeelioBirdBlue} />
        <Text style={[Typography.FONT_BOLD, Styles.ameelioLogo]}>Ameelio</Text>
      </View>
      <Text style={[Typography.FONT_BOLD, Styles.titleText]}>
        {i18n.t('BeginScreen.connectWithYourLovedOnes')},
      </Text>
      <Text style={[Typography.FONT_BOLD, Styles.titleText]}>
        {i18n.t('BeginScreen.forFree')}.
      </Text>
      <View style={{ paddingBottom: 60, paddingTop: 30 }}>
        <Image
          source={People}
          width={191}
          height={276.6}
          resizeMode="cover"
          style={{ width: 191, height: 276.6 }}
        />
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
            (Typography.FONT_BOLD,
            Styles.baseText,
            { color: Colors.PINK_DARKER })
          }
          containerStyle={{ height: 47 }}
        />
      </View>
    </View>
  );
};

export default BeginScreen;
