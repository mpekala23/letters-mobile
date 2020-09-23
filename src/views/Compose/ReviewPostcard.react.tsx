import React, { Dispatch } from 'react';
import { TouchableOpacity, View, Keyboard, Text } from 'react-native';
import { StaticPostcard } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, Screens } from '@utils/Screens';
import { Draft, Contact, MailTypes } from 'types';
import { AppState } from '@store/types';
import { connect } from 'react-redux';
import { createMail } from '@api';
import { cleanupAfterSend } from '@utils/Notifications';
import * as Segment from 'expo-analytics-segment';
import i18n from '@i18n';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { MailActionTypes } from '@store/Mail/MailTypes';
import { clearComposing } from '@store/Mail/MailActions';
import { setProfileOverride } from '@components/Topbar/Topbar.react';
import { Typography, Colors } from '@styles';
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
  route: {
    params: {
      horizontal: boolean;
      category: string;
    };
  };
}

class ReviewPostcardScreenBase extends React.Component<Props> {
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

  async doSend(): Promise<void> {
    try {
      await createMail(this.props.composing);
      Segment.trackWithProperties('Review - Send Letter Success', {
        type: 'postcard',
        facility: this.props.recipient.facility.name,
        facilityState: this.props.recipient.facility.state,
        facilityCity: this.props.recipient.facility.city,
        relationship: this.props.recipient.relationship,
        category: this.props.route.params.category,
        subcategory:
          this.props.composing.type === MailTypes.Postcard &&
          this.props.composing.design.subcategoryName,
        option:
          this.props.composing.type === MailTypes.Postcard &&
          this.props.composing.design.name,
      });
      this.props.clearComposing();
      cleanupAfterSend(this.props.recipient);
      this.props.navigation.reset({
        index: 0,
        routes: [
          {
            name: Screens.ReferFriends,
            params: { mailType: MailTypes.Postcard },
          },
        ],
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
        err.data &&
        err.data.content ===
          'The content may not be greater than 16000 characters.'
      ) {
        dropdownError({
          message: i18n.t('Error.letterTooLong'),
        });
      } else if (
        err.data &&
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
            horizontal={this.props.route.params.horizontal}
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
