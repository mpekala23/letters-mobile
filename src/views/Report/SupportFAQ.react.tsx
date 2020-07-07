import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Typography } from '@styles';
import { Button } from '@components';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from '@i18n';
import { SupportFAQTypes } from 'types';
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
    <ScrollView style={{ backgroundColor: 'white' }}>
      <View style={Styles.trueBackground}>
        <Text style={[Typography.FONT_BOLD, Styles.headerText]}>
          {i18n.t('SupportFAQScreen.howCanWeHelp')}
        </Text>
        <Button
          onPress={() => {
            props.navigation.navigate('SupportFAQDetail', {
              issue: SupportFAQTypes.DeleteLetter,
            });
          }}
          reverse
          buttonText={i18n.t('SupportFAQScreen.cancelMyLetter')}
          textStyle={Styles.buttonText}
          containerStyle={Styles.regularButton}
        />
        <Button
          onPress={() => {
            props.navigation.navigate('SupportFAQDetail', {
              issue: SupportFAQTypes.NotArrived,
            });
          }}
          reverse
          buttonText={i18n.t('SupportFAQScreen.notYetArrived')}
          textStyle={Styles.buttonText}
          containerStyle={Styles.regularButton}
        />
        <Button
          onPress={() => {
            props.navigation.navigate('SupportFAQDetail', {
              issue: SupportFAQTypes.WrongMailingAddress,
            });
          }}
          reverse
          buttonText={i18n.t('SupportFAQScreen.wrongMailingAddress')}
          textStyle={Styles.buttonText}
          containerStyle={Styles.regularButton}
        />
        <Button
          onPress={() => {
            props.navigation.navigate('SupportFAQDetail', {
              issue: SupportFAQTypes.WrongReturnAddress,
            });
          }}
          reverse
          buttonText={i18n.t('SupportFAQScreen.wrongReturnAddress')}
          textStyle={Styles.buttonText}
          containerStyle={Styles.regularButton}
        />
        <Button
          onPress={() => {
            props.navigation.navigate('SupportFAQDetail', {
              issue: SupportFAQTypes.TrackingNumber,
            });
          }}
          reverse
          buttonText={i18n.t('SupportFAQScreen.wouldLikeTrackingNumber')}
          textStyle={Styles.buttonText}
          containerStyle={Styles.regularButton}
        />
        <Button
          onPress={() => {
            props.navigation.navigate('SupportFAQDetail', {
              issue: SupportFAQTypes.TrackingError,
            });
          }}
          reverse
          buttonText={i18n.t('SupportFAQScreen.somethingWrongWithTracking')}
          textStyle={Styles.buttonText}
          containerStyle={Styles.regularButton}
        />
        <Button
          onPress={() => {
            props.navigation.navigate('SupportFAQDetail', {
              issue: SupportFAQTypes.TalkToAmeelio,
            });
          }}
          reverse
          buttonText={i18n.t('SupportFAQScreen.talkToAmeelio')}
          textStyle={Styles.buttonText}
          containerStyle={Styles.regularButton}
        />
      </View>
    </ScrollView>
  );
};

export default SupportFAQScreen;
