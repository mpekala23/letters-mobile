import React, { Dispatch } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Button, GrayBar } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { Letter, LetterStatus } from 'types';
import { Typography, Colors } from '@styles';
import {
  setDraft,
  setStatus,
  clearComposing,
} from '@store/Letter/LetterActions';
import { createLetter } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import i18n from '@i18n';
import { LetterActionTypes } from '@store/Letter/LetterTypes';
import Notifs from '@notifications';
import { NotifTypes } from '@store/Notif/NotifTypes';
import { Contact } from '@store/Contact/ContactTypes';
import { threeBusinessDaysFromNow, hoursTill8Tomorrow } from '@utils';
import autoMergeLevel1 from 'redux-persist/es/stateReconciler/autoMergeLevel1';
import Styles from './Compose.styles';

type LetterPreviewScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'LetterPreview'
>;

interface Props {
  navigation: LetterPreviewScreenNavigationProp;
  activeContact: Contact;
  composing: Letter;
  setDraft: (value: boolean) => void;
  setStatus: (status: LetterStatus) => void;
  clearComposing: () => void;
}

const LetterPreviewScreenBase: React.FC<Props> = (props: Props) => {
  const image = props.composing.photo;
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
            {props.composing.photo && (
              <Image
                source={props.composing.photo}
                style={{
                  height,
                  width,
                  borderRadius: 10,
                  aspectRatio:
                    props.composing.photo.width && props.composing.photo.height
                      ? props.composing.photo.width /
                        props.composing.photo.height
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
            props.setDraft(false);
            const { letterId } = await createLetter(props.composing);
            props.setStatus(LetterStatus.Created);
            props.clearComposing();
            Notifs.cancelAllNotificationsByType(NotifTypes.NoFirstLetter);
            Notifs.scheduleNotificationInHours(
              {
                title: `${i18n.t('Notifs.your')} letter ${i18n.t(
                  'Notifs.to'
                )} ${props.activeContact.firstName} ${i18n.t(
                  'Notifs.isOnItsWay'
                )}`,
                body: `${i18n.t('Notifs.expectedDelivery')}: ${new Date(
                  Date.now() + 1000
                ).toDateString()}`,
                data: {
                  type: NotifTypes.OnItsWay,
                  screen: 'LetterTracking',
                  data: {
                    contactId: props.activeContact.id,
                    letterId: letterId || -1,
                  },
                },
              },
              1 / 60 // TODO: Replace with notification from backend when ready + not beta testing
            );
            Notifs.scheduleNotificationInHours(
              {
                title: `${i18n.t('Notifs.yourLetterIsOut')} `,
                body: `${i18n.t(
                  'Notifs.expectedDelivery'
                )}: ${threeBusinessDaysFromNow()}`,
                data: {
                  type: NotifTypes.OutForDelivery,
                  screen: 'LetterTracking',
                  data: {
                    contactId: props.activeContact.id,
                    letterId: letterId || -1,
                  },
                },
              },
              2 / 60 // TODO: Replace with notification from backend when ready + not beta testing
            );
            Notifs.scheduleNotificationInHours(
              {
                title: `${i18n.t('Notifs.hasYourLovedOne')}`,
                body: `${i18n.t('Notifs.letUsKnow')}`,
                data: {
                  type: NotifTypes.HasReceived,
                  screen: 'Issues',
                },
              },
              3 / 60 // TODO: Replace with notification from backend when ready + not beta testing
            );
            Notifs.scheduleNotificationInHours(
              {
                title: `${i18n.t('Notifs.returnedToSender')}`,
                body: `${i18n.t('Notifs.getInTouch')}`,
                data: {
                  type: NotifTypes.ReturnedToSender,
                  screen: 'LetterTracking',
                  data: {
                    contactId: props.activeContact.id,
                  },
                },
              },
              4 / 60 // TODO: Replace with notification from backend when ready + not beta testing
            );
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
                  screen: 'SingleContact',
                  data: {
                    contactId: props.activeContact.id,
                  },
                },
              },
              hoursTill8Tomorrow() / 24 + 14 // TODO: Replace with notification from backend when ready + not beta testing
            );
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'ReferFriends' }],
            });
          } catch (err) {
            props.setDraft(true);
            if (err.message === 'Unable to upload image.') {
              dropdownError({
                message: i18n.t('Error.unableToUploadLetterPhoto'),
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
  composing: state.letter.composing,
  activeContact: state.contact.active,
});
const mapDispatchToProps = (dispatch: Dispatch<LetterActionTypes>) => {
  return {
    clearComposing: () => dispatch(clearComposing()),
    setDraft: (value: boolean) => dispatch(setDraft(value)),
    setStatus: (status: LetterStatus) => dispatch(setStatus(status)),
  };
};
const LetterPreviewScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(LetterPreviewScreenBase);

export default LetterPreviewScreen;
