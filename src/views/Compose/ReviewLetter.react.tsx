import React, { Dispatch } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Button, GrayBar } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
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

const ReviewLetterScreenBase: React.FC<Props> = (props: Props) => {
  if (props.composing.type !== MailTypes.Letter) {
    props.navigation.goBack();
    return null;
  }
  const { image } = props.composing;
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
        <Text style={[Typography.FONT_BOLD, { fontSize: 20 }]}>
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
            {props.composing.content}
          </Text>
          <View style={{ flex: 1 }}>
            {props.composing.image && (
              <Image
                source={props.composing.image}
                style={{
                  height,
                  width,
                  borderRadius: 10,
                  aspectRatio:
                    props.composing.image.width && props.composing.image.height
                      ? props.composing.image.width /
                        props.composing.image.height
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
      <Button
        buttonText={i18n.t('Compose.send')}
        blocking
        onPress={async () => {
          try {
            await createMail(props.composing);
            props.clearComposing();
            Segment.trackWithProperties('Review - Send Letter Success', {
              Option: 'Letter',
              facility: props.activeContact.facility?.name,
              facilityState: props.activeContact.facility?.state,
              facilityCity: props.activeContact.facility?.city,
              relationship: props.activeContact.relationship,
            });
            Notifs.cancelAllNotificationsByType(NotifTypes.NoFirstLetter);
            Notifs.cancelAllNotificationsByType(NotifTypes.Drought);
            Notifs.scheduleNotificationInDays(
              {
                title: `${i18n.t(
                  'Notifs.happy'
                )} ${new Date().toDateString()}! ${i18n.t(
                  'Notifs.readyToSendAnother'
                )} ${props.activeContact.firstName}?`,
                body: `${i18n.t('Notifs.clickHereToBegin')}`,
                data: {
                  type: NotifTypes.Drought,
                  data: {
                    contactId: props.activeContact.id,
                  },
                },
              },
              hoursTill8Tomorrow() / 24 + 7
            );
            deleteDraft();
            props.navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'ReferFriends',
                  params: { mailType: MailTypes.Letter },
                },
              ],
            });
          } catch (err) {
            Segment.trackWithProperties('Review - Send Letter Failure', {
              Option: 'letter',
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
            } else {
              dropdownError({
                message: i18n.t('Error.requestIncomplete'),
              });
            }
          }
        }}
      />
    </View>
  );
};

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
