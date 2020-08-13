import React, { Dispatch } from 'react';
import { TouchableOpacity, View, Keyboard } from 'react-native';
import { StaticPostcard, Button } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { Contact } from '@store/Contact/ContactTypes';
import { Draft } from 'types';
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

const ReviewPostcardScreenBase: React.FC<Props> = (props: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={1.0}
      style={Styles.gridTrueBackground}
      onPress={Keyboard.dismiss}
    >
      <View style={Styles.gridPreviewBackground}>
        <StaticPostcard
          front
          composing={props.composing}
          recipient={props.recipient}
        />
      </View>
      <View style={Styles.gridPreviewBackground}>
        <StaticPostcard
          front={false}
          composing={props.composing}
          recipient={props.recipient}
        />
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ padding: 16 }}>
        <Button
          buttonText={i18n.t('Compose.send')}
          blocking
          onPress={async () => {
            try {
              await createMail(props.composing);
              props.clearComposing();
              Segment.trackWithProperties('Compose - Click on Send', {
                Option: 'Letter',
              });
              Notifs.cancelAllNotificationsByType(NotifTypes.NoFirstLetter);
              Notifs.cancelAllNotificationsByType(NotifTypes.Drought);
              Notifs.scheduleNotificationInDays(
                {
                  title: `${i18n.t(
                    'Notifs.happy'
                  )} ${new Date().toDateString()}! ${i18n.t(
                    'Notifs.readyToSendAnother'
                  )} ${props.recipient.firstName}?`,
                  body: `${i18n.t('Notifs.clickHereToBegin')}`,
                  data: {
                    type: NotifTypes.Drought,
                    data: {
                      contactId: props.recipient.id,
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
              Segment.trackWithProperties('Review - Send Letter Failure', {
                Option: 'Letter',
                'Error Type': err,
              });
              if (err.message === 'Unable to upload image.') {
                dropdownError({
                  message: i18n.t('Error.unableToUploadLetterPhoto'),
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
    </TouchableOpacity>
  );
};

const mapStateToProps = (state: AppState) => ({
  composing: state.mail.composing,
  recipient: state.contact.active,
});

const mapDispatchToProps = (dispatch: Dispatch<MailActionTypes>) => ({
  clearComposing: () => dispatch(clearComposing()),
});

const ReviewPostcardScreen = connect(mapStateToProps)(ReviewPostcardScreenBase);

export default ReviewPostcardScreen;
