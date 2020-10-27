import React, { Dispatch } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Linking,
} from 'react-native';
import { ReviewCredits, StaticPostcard } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, Screens } from '@utils/Screens';
import {
  Draft,
  Contact,
  MailTypes,
  CustomFontFamilies,
  TopbarRight,
} from 'types';
import { AppState } from '@store/types';
import { connect } from 'react-redux';
import { createMail } from '@api';
import { cleanupAfterSend } from '@utils/Notifications';
import * as Segment from 'expo-analytics-segment';
import i18n from '@i18n';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { MailActionTypes } from '@store/Mail/MailTypes';
import { clearComposing } from '@store/Mail/MailActions';
import { Typography, Colors } from '@styles';
import { POSTCARD_HEIGHT, POSTCARD_WIDTH } from '@utils/Constants';
import { popupAlert } from '@components/Alert/Alert.react';
import { setTopbarRight } from '@store/UI/UIActions';
import { UIActionTypes } from '@store/UI/UITypes';
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
  ameelioBalance: number;
  plusBalance: number;
  setTopbarRight: (details: TopbarRight | null) => void;
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
    this.props.setTopbarRight({
      text: i18n.t('Compose.send'),
      action: this.doSend,
      enabled: true,
      blocking: true,
    });
  };

  onNavigationBlur = (): void => {
    this.props.setTopbarRight(null);
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
          this.props.composing.design.type === 'premade_postcard'
            ? this.props.composing.design.name
            : undefined,
        contentResearcher:
          this.props.composing.type === MailTypes.Postcard &&
          this.props.composing.design.type === 'premade_postcard'
            ? this.props.composing.design.contentResearcher
            : undefined,
        designer:
          this.props.composing.type === MailTypes.Postcard &&
          this.props.composing.design.type === 'premade_postcard'
            ? this.props.composing.design.designer
            : undefined,
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
    const font =
      this.props.composing.type === MailTypes.Postcard
        ? this.props.composing.customization.font
        : {
            family: CustomFontFamilies.Montserrat,
            color: '#000000',
          };
    const plusCost =
      this.props.composing.type === MailTypes.Postcard &&
      this.props.composing.size.isPremium
        ? this.props.composing.size.cost
        : 0;

    return (
      <View style={Styles.screenBackground}>
        <ScrollView style={{ flex: 1 }}>
          <TouchableOpacity activeOpacity={1.0} style={{ paddingVertical: 16 }}>
            <StaticPostcard
              front
              composing={this.props.composing}
              recipient={this.props.recipient}
              width={POSTCARD_WIDTH}
              height={POSTCARD_HEIGHT}
              style={{ marginBottom: 16 }}
              font={font}
            />
            <StaticPostcard
              front={false}
              composing={this.props.composing}
              recipient={this.props.recipient}
              width={POSTCARD_WIDTH}
              height={POSTCARD_HEIGHT}
              font={font}
            />
            <View style={{ flex: 1 }} />
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
            <ReviewCredits
              type={plusCost > 0 ? 'premium' : 'free'}
              cost={plusCost > 0 ? plusCost : 1}
              balance={
                plusCost > 0
                  ? this.props.plusBalance
                  : this.props.ameelioBalance
              }
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  composing: state.mail.composing,
  recipient: state.contact.active,
  ameelioBalance: state.user.user.credit,
  plusBalance: state.user.user.coins,
});

const mapDispatchToProps = (
  dispatch: Dispatch<MailActionTypes | UIActionTypes>
) => ({
  clearComposing: () => dispatch(clearComposing()),
  setTopbarRight: (details: TopbarRight | null) =>
    dispatch(setTopbarRight(details)),
});

const ReviewPostcardScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewPostcardScreenBase);

export default ReviewPostcardScreen;
