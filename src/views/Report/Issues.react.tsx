import React, { Dispatch } from 'react';
import { Text, View } from 'react-native';
import { Typography } from '@styles';
import { Button } from '@components';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from '@i18n';
import { DeliveryReportTypes } from 'types';
import { Notif, NotifActionTypes } from '@store/Notif/NotifTypes';
import { AppState } from '@store/types';
import { handleNotif } from '@store/Notif/NotifiActions';
import { connect } from 'react-redux';
import * as Segment from 'expo-analytics-segment';
import ReportStyles from './Report.styles';

type IssueScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Issues'
>;

interface Props {
  navigation: IssueScreenNavigationProp;
  currentNotif: Notif | null;
  handleNotif: () => void;
}

class IssuesScreenBase extends React.Component<Props> {
  componentDidMount(): void {
    if (this.props.currentNotif && this.props.currentNotif.screen === 'Issues')
      this.props.handleNotif();
  }

  render(): JSX.Element {
    return (
      <View style={ReportStyles.background}>
        <Text
          style={[
            Typography.FONT_BOLD,
            ReportStyles.question,
            { marginBottom: 10 },
          ]}
        >
          {i18n.t('IssuesScreen.hasYourLovedOneReceivedLetter')}
        </Text>
        <Text
          style={[
            Typography.FONT_REGULAR,
            ReportStyles.description,
            { marginBottom: 50 },
          ]}
        >
          {i18n.t('IssuesScreen.letUsKnowIfThereIsAProblem')}
        </Text>
        <Button
          buttonText={i18n.t('IssuesScreen.yepTheyReceivedIt')}
          onPress={() => {
            this.props.navigation.navigate('IssuesDetail', {
              issue: DeliveryReportTypes.received,
            });
            Segment.track('Delivery Reporting - Success');
          }}
          containerStyle={ReportStyles.buttonReverse}
          textStyle={[Typography.FONT_MEDIUM, ReportStyles.buttonText]}
        />
        <Button
          buttonText={i18n.t('IssuesScreen.notSureYet')}
          onPress={() => {
            this.props.navigation.navigate('IssuesDetail', {
              issue: DeliveryReportTypes.unsure,
            });
            Segment.track('Delivery Reporting - Unknown');
          }}
          containerStyle={ReportStyles.buttonReverse}
          textStyle={[Typography.FONT_MEDIUM, ReportStyles.buttonText]}
        />
        <Button
          buttonText={i18n.t('IssuesScreen.notYetReceived')}
          onPress={() => {
            this.props.navigation.navigate('IssuesDetail', {
              issue: DeliveryReportTypes.notYetReceived,
            });
            Segment.track('Delivery Reporting - Failure');
          }}
          containerStyle={ReportStyles.buttonReverse}
          textStyle={[Typography.FONT_MEDIUM, ReportStyles.buttonText]}
        />
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  currentNotif: state.notif.currentNotif,
});
const mapDispatchToProps = (dispatch: Dispatch<NotifActionTypes>) => ({
  handleNotif: () => dispatch(handleNotif()),
});
const IssuesScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(IssuesScreenBase);

export default IssuesScreen;
