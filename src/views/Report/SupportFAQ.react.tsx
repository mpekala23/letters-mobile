import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Typography } from '@styles';
import { Button } from '@components';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from '@i18n';
import { SupportFAQTypes } from 'types';
import * as Segment from 'expo-analytics-segment';
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
            Segment.trackWithProperties(
              'In-App Reporting - Click on Problem Option',
              { Option: 'delays' }
            );
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
            Segment.trackWithProperties(
              'In-App Reporting - Click on Problem Option',
              { Option: 'delete letter' }
            );
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
            Segment.trackWithProperties(
              'In-App Reporting - Click on Problem Option',
              { Option: 'wrong mailing address' }
            );
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
            Segment.trackWithProperties(
              'In-App Reporting - Click on Problem Option',
              { Option: 'wrong return address' }
            );
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
            Segment.trackWithProperties(
              'In-App Reporting - Click on Problem Option',
              { Option: 'tracking number' }
            );
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
            Segment.trackWithProperties(
              'In-App Reporting - Click on Problem Option',
              { Option: 'tracking error' }
            );
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
            Segment.trackWithProperties(
              'In-App Reporting - Click on Problem Option',
              { Option: 'support' }
            );
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
