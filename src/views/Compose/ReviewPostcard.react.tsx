import React, { Dispatch } from 'react';
import { TouchableOpacity, View, Keyboard } from 'react-native';
import { StaticPostcard, Button } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { Draft, Contact } from 'types';
import { AppState } from '@store/types';
import { connect } from 'react-redux';
import { createMail } from '@api';
import { hoursTill8Tomorrow } from '@utils';
import * as Segment from 'expo-analytics-segment';
import { deleteDraft } from '@api/User';
import Notifs from '@notifications';
import { NotifTypes } from '@store/Notif/NotifTypes';
import i18n from '@i18n';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { MailActionTypes } from '@store/Mail/MailTypes';
import { clearComposing } from '@store/Mail/MailActions';
import { setProfileOverride } from '@components/Topbar/Topbar.react';
import Styles from './Compose.styles';

type ReviewPostcardScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ReviewPostcard'
>;

export interface Props {
  navigation: ReviewPostcardScreenNavigationProp;
  composing: Draft;
  recipient: Contact;
  clearComposing: () => void;
}

class ReviewPostcardScreenBase extends React.Component<Props> {
  private unsubscribeFocus: () => void;

  private unsubscribeBlur: () => void;

  constructor(props: Props) {
    super(props);
    this.unsubscribeFocus = props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );
    this.unsubscribeBlur = props.navigation.addListener(
      'blur',
      this.onNavigationBlur
    );
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
    this.unsubscribeBlur();
  }

  onNavigationFocus = (): void => {
    setProfileOverride({
      text: i18n.t('Compose.send'),
      action: this.doSend,
      enabled: true,
      blocking: true,
    });
  };

  onNavigationBlur = (): void => {
    setProfileOverride(undefined);
  };

  async doSend(): Promise<void> {
    try {
      await createMail(this.props.composing);
      this.props.clearComposing();
      Segment.trackWithProperties('Review - Send Letter Success', {
        Option: 'Postcard',
        facility: this.props.recipient.facility?.name,
        facilityState: this.props.recipient.facility?.state,
        facilityCity: this.props.recipient.facility?.city,
        relationship: this.props.recipient.relationship,
      });
      Notifs.cancelAllNotificationsByType(NotifTypes.NoFirstLetter);
      Notifs.cancelAllNotificationsByType(NotifTypes.Drought);
      Notifs.scheduleNotificationInDays(
        {
          title: `${i18n.t(
            'Notifs.happy'
          )} ${new Date().toDateString()}! ${i18n.t(
            'Notifs.readyToSendAnother'
          )} ${this.props.recipient.firstName}?`,
          body: `${i18n.t('Notifs.clickHereToBegin')}`,
          data: {
            type: NotifTypes.Drought,
            data: {
              contactId: this.props.recipient.id,
            },
          },
        },
        hoursTill8Tomorrow() / 24 + 14
      );
      deleteDraft();
      this.props.navigation.reset({
        index: 0,
        routes: [{ name: 'ReferFriends' }],
      });
    } catch (err) {
      Segment.trackWithProperties('Review - Send Letter Failure', {
        Option: 'postcard',
        'Error Type': err,
      });
      if (err.message === 'Image upload timeout') {
        // timeout that occurred during image upload
        dropdownError({
          message: i18n.t('Error.uploadImageTimeout'),
        });
      } else if (err.message === 'timeout') {
        // timout that occurred during the normal request
        dropdownError({
          message: i18n.t('Error.requestTimedOut'),
        });
      } else if (
        err.data.content ===
        'The content may not be greater than 16000 characters.'
      ) {
        dropdownError({
          message: i18n.t('Error.letterTooLong'),
        });
      } else if (err.data.content === 'The content field is required.') {
        dropdownError({
          message: i18n.t('Compose.letterMustHaveContent'),
        });
      } else {
        dropdownError({
          message: i18n.t('Error.requestIncomplete'),
        });
      }
    }
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={1.0}
        style={Styles.gridTrueBackground}
        onPress={Keyboard.dismiss}
      >
        <View style={Styles.gridPreviewBackground}>
          <StaticPostcard
            front
            composing={this.props.composing}
            recipient={this.props.recipient}
          />
        </View>
        <View style={Styles.gridPreviewBackground}>
          <StaticPostcard
            front={false}
            composing={this.props.composing}
            recipient={this.props.recipient}
          />
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ padding: 16 }}>
          <Button
            buttonText={i18n.t('Compose.send')}
            blocking
            onPress={async () => {
              try {
                await createMail(this.props.composing);
                this.props.clearComposing();
                Segment.trackWithProperties('Review - Send Letter Success', {
                  Option: 'Postcard',
                  facility: this.props.recipient.facility?.name,
                  facilityState: this.props.recipient.facility?.state,
                  facilityCity: this.props.recipient.facility?.city,
                  relationship: this.props.recipient.relationship,
                });
                Notifs.cancelAllNotificationsByType(NotifTypes.NoFirstLetter);
                Notifs.cancelAllNotificationsByType(NotifTypes.Drought);
                Notifs.scheduleNotificationInDays(
                  {
                    title: `${i18n.t(
                      'Notifs.happy'
                    )} ${new Date().toDateString()}! ${i18n.t(
                      'Notifs.readyToSendAnother'
                    )} ${this.props.recipient.firstName}?`,
                    body: `${i18n.t('Notifs.clickHereToBegin')}`,
                    data: {
                      type: NotifTypes.Drought,
                      data: {
                        contactId: this.props.recipient.id,
                      },
                    },
                  },
                  hoursTill8Tomorrow() / 24 + 14
                );
                deleteDraft();
                this.props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'ReferFriends' }],
                });
              } catch (err) {
                Segment.trackWithProperties('Review - Send Letter Failure', {
                  Option: 'postcard',
                  'Error Type': err,
                });
                if (err.message === 'Image upload timeout') {
                  // timeout that occurred during image upload
                  dropdownError({
                    message: i18n.t('Error.uploadImageTimeout'),
                  });
                } else if (err.message === 'timeout') {
                  // timout that occurred during the normal request
                  dropdownError({
                    message: i18n.t('Error.requestTimedOut'),
                  });
                } else if (
                  err.data.content ===
                  'The content may not be greater than 16000 characters.'
                ) {
                  dropdownError({
                    message: i18n.t('Error.letterTooLong'),
                  });
                } else if (
                  err.data.content === 'The content field is required.'
                ) {
                  dropdownError({
                    message: i18n.t('Compose.letterMustHaveContent'),
                  });
                } else {
                  dropdownError({
                    message: i18n.t('Error.requestIncomplete'),
                  });
                }
              }
            }}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  composing: state.mail.composing,
  recipient: state.contact.active,
});

const mapDispatchToProps = (dispatch: Dispatch<MailActionTypes>) => ({
  clearComposing: () => dispatch(clearComposing()),
});

const ReviewPostcardScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewPostcardScreenBase);

export default ReviewPostcardScreen;
