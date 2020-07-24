import React, { Dispatch } from 'react';
import { View, Text, Image } from 'react-native';
import { Button, GenericCard, Icon, GrayBar } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { Letter, LetterStatus, Photo } from 'types';
import { Colors, Typography } from '@styles';
import {
  setDraft,
  setStatus,
  clearComposing,
  setPhoto,
  setContent,
} from '@store/Letter/LetterActions';
import { createLetter } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import i18n from '@i18n';
import { LetterActionTypes } from '@store/Letter/LetterTypes';
import Stamp from '@assets/views/Compose/Stamp';
import Notifs from '@notifications';
import { NotifTypes } from '@store/Notif/NotifTypes';
import { Contact } from '@store/Contact/ContactTypes';
import { threeBusinessDaysFromNow, hoursTill8Tomorrow } from '@utils';
import Styles from './Compose.styles';

type PostcardPreviewScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'PostcardPreview'
>;

interface Props {
  navigation: PostcardPreviewScreenNavigationProp;
  composing: Letter;
  activeContact: Contact;
  setDraft: (value: boolean) => void;
  setStatus: (status: LetterStatus) => void;
  clearComposing: () => void;
  setContent: (content: string) => void;
  setPhoto: (photo: Photo | undefined) => void;
}

const PostcardPreviewScreenBase: React.FC<Props> = (props: Props) => {
  return (
    <View style={Styles.screenBackground}>
      <View style={{ flex: 1 }}>
        <GenericCard style={Styles.postcardBackground}>
          <View style={{ flex: 1 }}>
            {props.composing.photo && (
              <Image
                source={{ uri: props.composing.photo?.uri }}
                style={{ width: '100%', aspectRatio: 1 }}
              />
            )}
          </View>
          <GrayBar vertical />
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Icon svg={Stamp} style={{ alignSelf: 'flex-end' }} />
            <Text style={Typography.FONT_REGULAR}>
              {i18n.t('Compose.to')}: {props.activeContact.firstName}
            </Text>
            <GrayBar />
            <GrayBar />
            <GrayBar />
            <GrayBar />
            <GrayBar />
            <GrayBar />
          </View>
        </GenericCard>
        <GenericCard style={{ minHeight: 200 }}>
          <Text
            style={[Typography.FONT_REGULAR, { marginTop: 20, fontSize: 14 }]}
          >
            {props.composing.content}
          </Text>
        </GenericCard>
      </View>
      <Text
        style={[
          Typography.FONT_REGULAR,
          {
            fontSize: 16,
            color: Colors.GRAY_MEDIUM,
            textAlign: 'center',
          },
        ]}
      >
        {i18n.t('Compose.warningCantCancel')}
      </Text>
      <Button
        buttonText={i18n.t('Compose.sendPostcard')}
        blocking
        onPress={async () => {
          try {
            props.setDraft(false);
            const { letterId } = await createLetter(props.composing);
            props.setStatus(LetterStatus.Created);
            props.clearComposing();
            props.setContent('');
            props.setPhoto(undefined);
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
              1 / 60 / 10
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
              2 / 60 / 10
            );
            Notifs.scheduleNotificationInHours(
              {
                title: `${i18n.t('Notifs.hasYourLovedOne')}`,
                body: `${i18n.t('Notifs.letUsKnow')}`,
                data: {
                  type: NotifTypes.HasReceived,
                  screen: 'Issues',
                  data: {
                    contactId: props.activeContact.id,
                    letterId: letterId || -1,
                  },
                },
              },
              3 / 60 / 10
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
                    letterId: letterId || -1,
                  },
                },
              },
              4 / 60 / 10
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
              hoursTill8Tomorrow() / 24 + 14
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
    setContent: (content: string) => dispatch(setContent(content)),
    setPhoto: (photo: Photo | undefined) => dispatch(setPhoto(photo)),
  };
};
const PostcardPreviewScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(PostcardPreviewScreenBase);

export default PostcardPreviewScreen;
