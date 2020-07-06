import React from 'react';
import { Text, View } from 'react-native';
import i18n from '@i18n';
import { Icon, Button } from '@components';
import AmeelioBirdPink from '@assets/AmeelioBirdPinkSmall';
import { Colors, Typography } from '@styles';
import { AuthStackParamList } from 'navigations';
import { StackNavigationProp } from '@react-navigation/stack';
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
        <Icon svg={AmeelioBirdPink} />
        <Text style={[Typography.FONT_BOLD, Styles.ameelioLogo]}>Ameelio</Text>
      </View>
      <Text style={[Typography.FONT_BOLD, Styles.titleText]}>
        {i18n.t('BeginScreen.connectWithYourLovedOnes')},
      </Text>
      <Text
        style={[
          Typography.FONT_BOLD,
          Styles.titleText,
          { paddingBottom: '80%' },
        ]}
      >
        {i18n.t('BeginScreen.forFree')}.
      </Text>
      <View style={{ position: 'absolute', bottom: 24, width: '100%' }}>
        <Button
          onPress={() => props.navigation.navigate('Register')}
          buttonText={i18n.t('BeginScreen.signUp')}
          textStyle={(Typography.FONT_BOLD, Styles.baseText)}
          containerStyle={Styles.registerButton}
        />
        <Button
          onPress={() => props.navigation.navigate('Login')}
          buttonText={i18n.t('BeginScreen.logIn')}
          textStyle={
            (Typography.FONT_BOLD,
            Styles.baseText,
            { color: Colors.PINK_DARKER })
          }
          containerStyle={Styles.loginButton}
        />
      </View>
    </View>
  );
};

export default BeginScreen;
