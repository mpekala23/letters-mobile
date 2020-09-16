import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Typography } from '@styles';
import { ListItem } from '@components';
import { AppStackParamList, Screens } from '@utils/Screens';
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

const FAQList = [
  {
    text: i18n.t('SupportFAQScreen.cancelMyLetter'),
    issue: SupportFAQTypes.DeleteLetter,
    segmentOption: 'delays',
  },
  {
    text: i18n.t('SupportFAQScreen.notYetArrived'),
    issue: SupportFAQTypes.NotArrived,
    segmentOption: 'delete letter',
  },
  {
    text: i18n.t('SupportFAQScreen.wrongMailingAddress'),
    issue: SupportFAQTypes.WrongMailingAddress,
    segmentOption: 'wrong mailing address',
  },
  {
    text: i18n.t('SupportFAQScreen.wrongReturnAddress'),
    issue: SupportFAQTypes.WrongReturnAddress,
    segmentOption: 'wrong return address',
  },
  {
    text: i18n.t('SupportFAQScreen.wouldLikeTrackingNumber'),
    issue: SupportFAQTypes.TrackingNumber,
    segmentOption: 'tracking number',
  },
  {
    text: i18n.t('SupportFAQScreen.somethingWrongWithTracking'),
    issue: SupportFAQTypes.TrackingError,
    segmentOption: 'tracking error',
  },
  {
    text: i18n.t('SupportFAQScreen.talkToAmeelio'),
    issue: SupportFAQTypes.TalkToAmeelio,
    segmentOption: 'support',
  },
];

const SupportFAQScreen: React.FC<Props> = (props: Props) => {
  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <View style={Styles.trueBackground}>
        <Text style={[Typography.FONT_SEMIBOLD, Styles.headerText]}>
          {i18n.t('SupportFAQScreen.howCanWeHelp')}
        </Text>
        {FAQList.map((item) => (
          <ListItem
            key={item.text}
            onPress={() => {
              props.navigation.navigate(Screens.SupportFAQDetail, {
                issue: item.issue,
              });
              Segment.trackWithProperties(
                'In-App Reporting - Click on Problem Option',
                { Option: item.segmentOption }
              );
            }}
            itemText={item.text}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default SupportFAQScreen;
