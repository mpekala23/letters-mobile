import React from 'react';
import { Text, View, Linking } from 'react-native';
import { Typography } from '@styles';
import { Button } from '@components';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from '@i18n';
import { SupportFAQTypes } from 'types';
import Emoji from 'react-native-emoji';
import Styles from './SupportFAQ.styles';

type SupportFAQDetailScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'SupportFAQDetail'
>;

interface Props {
  navigation: SupportFAQDetailScreenNavigationProp;
  route: {
    params: { issue: SupportFAQTypes };
  };
}

function mapIssueToFAQDetails(type: SupportFAQTypes) {
  switch (type) {
    case SupportFAQTypes.DeleteLetter:
      return (
        <Text>
          {i18n.t('SupportFAQDetailScreen.cancelMyLetter1')}{' '}
          <Emoji name="pensive" />.{' '}
          {i18n.t('SupportFAQDetailScreen.cancelMyLetter2')}
        </Text>
      );
    case SupportFAQTypes.NotArrived:
      return i18n.t('SupportFAQDetailScreen.notYetArrived');
    case SupportFAQTypes.WrongMailingAddress:
      return i18n.t('SupportFAQDetailScreen.wrongMailingAddress');
    case SupportFAQTypes.WrongReturnAddress:
      return i18n.t('SupportFAQDetailScreen.wrongReturnAddress');
    case SupportFAQTypes.TrackingNumber:
      return (
        <Text>
          {i18n.t('SupportFAQDetailScreen.trackingNumber')}{' '}
          <Emoji name="pensive" />
        </Text>
      );
    case SupportFAQTypes.TrackingError:
      return i18n.t('SupportFAQDetailScreen.trackingError');
    default:
      return i18n.t('SupportFAQDetailScreen.talkToAmeelio');
  }
}

function defaultCTAButton(onPress: () => void, buttonText: string) {
  return (
    <Button
      onPress={onPress}
      buttonText={buttonText}
      textStyle={{ fontSize: 18 }}
      containerStyle={Styles.needHelpButton}
    />
  );
}

function mapIssueToFAQCTA(props: Props, type: SupportFAQTypes) {
  switch (type) {
    case SupportFAQTypes.DeleteLetter:
      return null;
    case SupportFAQTypes.NotArrived:
      return null;
    case SupportFAQTypes.WrongMailingAddress:
      return defaultCTAButton(() => {
        props.navigation.reset({
          index: 0,
          routes: [
            { name: 'ContactSelector' },
            { name: 'SingleContact' },
            { name: 'LetterTracking' },
            { name: 'UpdateContact' },
          ],
        });
      }, i18n.t('SupportFAQDetailScreen.updateAddress'));
    case SupportFAQTypes.WrongReturnAddress:
      return defaultCTAButton(() => {
        props.navigation.reset({
          index: 0,
          routes: [
            { name: 'ContactSelector' },
            { name: 'SingleContact' },
            { name: 'LetterTracking' },
            { name: 'UpdateContact' },
          ],
        });
      }, i18n.t('SupportFAQDetailScreen.updateProfile'));
    case SupportFAQTypes.TrackingNumber:
      return null;
    default:
      return defaultCTAButton(async () => {
        await Linking.openURL('https://m.me/teamameelio');
      }, i18n.t('SupportFAQDetailScreen.reachOutToSupport'));
  }
}

const SupportFAQDetailScreen: React.FC<Props> = (props: Props) => {
  const { issue } = props.route.params;
  return (
    <View
      style={[
        Styles.trueBackground,
        { backgroundColor: props.navigation ? undefined : '' },
      ]}
    >
      <Text style={[Typography.FONT_BOLD, Styles.headerText]}>
        {i18n.t('SupportFAQDetailScreen.talkToSomeoneAtAmeelio')}
      </Text>
      <Text style={Styles.baseText}>{mapIssueToFAQDetails(issue)}</Text>
      <View style={{ width: '100%' }} testID="callToActionButton">
        {mapIssueToFAQCTA(props, issue)}
      </View>
    </View>
  );
};

export default SupportFAQDetailScreen;
