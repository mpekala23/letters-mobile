import React, { Dispatch } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { GrayBar } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, Screens } from '@utils/Screens';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { Draft, MailTypes, Contact } from 'types';
import { Typography, Colors } from '@styles';
import { clearComposing } from '@store/Mail/MailActions';
import { createMail } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import i18n from '@i18n';
import { MailActionTypes } from '@store/Mail/MailTypes';
import Notifs from '@notifications';
import { NotifTypes } from '@store/Notif/NotifTypes';
import { hoursTill8Tomorrow } from '@utils';
import * as Segment from 'expo-analytics-segment';
import { deleteDraft } from '@api/User';
import { setProfileOverride } from '@components/Topbar/Topbar.react';
import Styles from './Compose.styles';

type ReviewLetterScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ReviewLetter'
>;

interface Props {
  navigation: ReviewLetterScreenNavigationProp;
  activeContact: Contact;
  composing: Draft;
  clearComposing: () => void;
}

class ReviewLetterScreenBase extends React.Component<Props> {
  private unsubscribeFocus: () => void;

  private unsubscribeBlur: () => void;

  constructor(props: Props) {
    super(props);
    this.doSend = this.doSend.bind(this);
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

  async doSend() {
    try {
      await createMail(this.props.composing);
      this.props.clearComposing();
      Segment.trackWithProperties('Review - Send Letter Success', {
        type: 'letter',
        facility: this.props.activeContact.facility?.name,
        facilityState: this.props.activeContact.facility?.state,
        facilityCity: this.props.activeContact.facility?.city,
        relationship: this.props.activeContact.relationship,
      });
      Notifs.cancelAllNotificationsByType(NotifTypes.NoFirstLetter);
      Notifs.cancelAllNotificationsByType(NotifTypes.Drought);
      Notifs.scheduleNotificationInDays(
        {
          title: `${i18n.t(
            'Notifs.happy'
          )} ${new Date().toDateString()}! ${i18n.t(
            'Notifs.readyToSendAnother'
          )} ${this.props.activeContact.firstName}?`,
          body: `${i18n.t('Notifs.clickHereToBegin')}`,
          data: {
            type: NotifTypes.Drought,
            data: {
              contactId: this.props.activeContact.id,
            },
          },
        },
        hoursTill8Tomorrow() / 24 + 7
      );
      deleteDraft();
      this.props.navigation.reset({
        index: 0,
        routes: [
          {
            name: Screens.ReferFriends,
            params: { mailType: MailTypes.Letter },
          },
        ],
      });
    } catch (err) {
      Segment.trackWithProperties('Review - Send Letter Failure', {
        type: 'letter',
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
        err.data &&
        err.data.content ===
          'The content may not be greater than 16000 characters.'
      ) {
        dropdownError({
          message: i18n.t('Error.letterTooLong'),
        });
      } else {
        dropdownError({
          message: i18n.t('Error.requestIncomplete'),
        });
      }
    }
  }

  render() {
    if (this.props.composing.type !== MailTypes.Letter) {
      this.props.navigation.goBack();
      return null;
    }
    const { image } = this.props.composing;
    let width = 275;
    let height = 275;
    if (image && image.width && image.height) {
      if (image.width > image.height) {
        height = (image.height / image.width) * width;
      } else {
        width = (image.width / image.height) * height;
      }
    }
    return (
      <View style={Styles.screenBackground}>
        <View style={{ flex: 1 }}>
          <Text style={[Typography.FONT_SEMIBOLD, { fontSize: 20 }]}>
            {i18n.t('Compose.preview')}
          </Text>
          <GrayBar />
          <ScrollView>
            <Text
              style={[
                Typography.FONT_REGULAR,
                { marginVertical: 20, fontSize: 14 },
              ]}
            >
              {this.props.composing.content}
            </Text>
            <View style={{ flex: 1 }}>
              {this.props.composing.image && (
                <Image
                  source={this.props.composing.image}
                  style={{
                    height,
                    width,
                    borderRadius: 10,
                    aspectRatio:
                      image && image.width && image.height
                        ? image.width / image.height
                        : 1,
                  }}
                />
              )}
            </View>
          </ScrollView>
        </View>
        <Text
          style={[
            Typography.FONT_REGULAR,
            {
              fontSize: 16,
              color: Colors.GRAY_MEDIUM,
              textAlign: 'center',
              margin: 10,
            },
          ]}
        >
          {i18n.t('Compose.warningCantCancel')}
        </Text>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  composing: state.mail.composing,
  activeContact: state.contact.active,
});
const mapDispatchToProps = (dispatch: Dispatch<MailActionTypes>) => {
  return {
    clearComposing: () => dispatch(clearComposing()),
  };
};
const LetterPreviewScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewLetterScreenBase);

export default LetterPreviewScreen;
