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
import { hoursTill8Tomorrow } from '@utils';
import * as Segment from 'expo-analytics-segment';
import { deleteDraft } from '@api/User';
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
            await createLetter(props.composing);
            props.setStatus(LetterStatus.Created);
            props.clearComposing();
            props.setContent('');
            props.setPhoto(undefined);
            Segment.trackWithProperties('Compose - Click on Send', {
              Option: 'Photo',
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
              hoursTill8Tomorrow() / 24 + 14
            );
            deleteDraft();
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'ReferFriends' }],
            });
          } catch (err) {
            props.setDraft(true);
            Segment.trackWithProperties('Review - Send Letter Failure', {
              Option: 'Photo',
              'Error Type': err,
            });
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
