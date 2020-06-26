import React from 'react';
import { Text, View } from 'react-native';
import { Typography } from '@styles';
import { Button } from '@components';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from '@i18n';
import Styles from './SupportFAQ.styles';

type SupportFAQScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'SupportFAQ'
>;

interface Props {
  navigation: SupportFAQScreenNavigationProp;
}

const SupportFAQScreen: React.FC<Props> = (props: Props) => {
  return (
    <View style={Styles.trueBackground}>
      <Text style={[Typography.FONT_BOLD, Styles.headerText]}>
        {i18n.t('SupportFAQScreen.howCanWeHelp')}
      </Text>
      <Button
        onPress={() => {
          props.navigation.navigate('SupportFAQDetail');
        }}
        reverse
        buttonText={i18n.t('SupportFAQScreen.cancelMyLetter')}
        textStyle={Styles.buttonText}
        containerStyle={Styles.regularButton}
      />
      <Button
        onPress={() => {
          props.navigation.navigate('SupportFAQDetail');
        }}
        reverse
        buttonText={i18n.t('SupportFAQScreen.takeLongTimeToArrive')}
        textStyle={Styles.buttonText}
        containerStyle={Styles.regularButton}
      />
      <Button
        onPress={() => {
          props.navigation.navigate('SupportFAQDetail');
        }}
        reverse
        buttonText={i18n.t('SupportFAQScreen.notYetArrived')}
        textStyle={Styles.buttonText}
        containerStyle={Styles.tallButton}
      />
      <Button
        onPress={() => {
          props.navigation.navigate('SupportFAQDetail');
        }}
        reverse
        buttonText={i18n.t('SupportFAQScreen.wrongMailingAddress')}
        textStyle={Styles.buttonText}
        containerStyle={Styles.regularButton}
      />
      <Button
        onPress={() => {
          props.navigation.navigate('SupportFAQDetail');
        }}
        reverse
        buttonText={i18n.t('SupportFAQScreen.somethingWrongWithTracking')}
        textStyle={Styles.buttonText}
        containerStyle={Styles.regularButton}
      />
      <Button
        onPress={() => {
          props.navigation.navigate('SupportFAQDetail');
        }}
        reverse
        buttonText={i18n.t('SupportFAQScreen.somethingElse')}
        textStyle={Styles.buttonText}
        containerStyle={Styles.regularButton}
      />
    </View>
  );
};

export default SupportFAQScreen;
