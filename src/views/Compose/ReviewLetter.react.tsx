import React, { Dispatch } from 'react';
import { View, Text, ScrollView, Linking } from 'react-native';
import { GrayBar, DisplayImage } from '@components';
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
import { cleanupAfterSend } from '@utils/Notifications';
import * as Segment from 'expo-analytics-segment';
import { setProfileOverride } from '@components/Topbar';
import { popupAlert } from '@components/Alert/Alert.react';
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
      cleanupAfterSend(this.props.activeContact);
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
        Option: 'postcard',
        'Error Type': err,
      });
      if (
        err.data &&
        err.data.content ===
          'The content may not be greater than 16000 characters.'
      ) {
        dropdownError({
          message: i18n.t('Error.letterTooLong'),
        });
        return;
      }
      if (err.data && err.data.content === 'The content field is required.') {
        dropdownError({
          message: i18n.t('Compose.letterMustHaveContent'),
        });
        return;
      }
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
      } else if (err.message === 'Too Many Attempts.') {
        dropdownError({
          message: i18n.t('Error.tooManyAttempts'),
        });
      } else {
        dropdownError({
          message: i18n.t('Error.requestIncomplete'),
        });
      }
      popupAlert({
        title: i18n.t('Error.cantSendMailModalTitle'),
        message: i18n.t('Error.cantSendMailModalBody'),
        buttons: [
          {
            text: i18n.t('Error.reachOutToSupport'),
            onPress: async () => {
              await Linking.openURL('https://m.me/teamameelio');
            },
          },
          {
            text: i18n.t('Error.noThanks'),
            reverse: true,
          },
        ],
      });
    }
  }

  render() {
    if (this.props.composing.type !== MailTypes.Letter) {
      this.props.navigation.goBack();
      return null;
    }

    return (
      <View style={[Styles.screenBackground, { paddingTop: 16 }]}>
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
            <DisplayImage images={this.props.composing.images} local />
          </ScrollView>
        </View>
        <Text
          style={[
            Typography.FONT_REGULAR,
            {
              fontSize: 16,
              color: Colors.GRAY_300,
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
