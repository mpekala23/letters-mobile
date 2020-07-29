import React, { Dispatch } from 'react';
import { Text, View } from 'react-native';
import { LetterOptionCard } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { LetterTypes, Letter, Photo } from 'types';
import { Colors, Typography } from '@styles';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import {
  setType,
  setRecipientId,
  setContent,
  setPhoto,
} from '@store/Letter/LetterActions';
import { LetterActionTypes } from '@store/Letter/LetterTypes';
import { STATE_TO_ABBREV } from '@utils';
import i18n from '@i18n';
import { popupAlert } from '@components/Alert/Alert.react';
import { setActive as setActiveContact } from '@store/Contact/ContactActions';
import { Contact, ContactActionTypes } from '@store/Contact/ContactTypes';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { UserState } from '@store/User/UserTypes';
import * as Segment from 'expo-analytics-segment';
import Styles from './Compose.styles';

type ChooseOptionsScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Home'
>;

interface Props {
  navigation: ChooseOptionsScreenNavigationProp;
  composing: Letter;
  userState: UserState;
  recipientId: number;
  existingContacts: Contact[];
  setType: (type: LetterTypes) => void;
  setRecipientId: (id: number) => void;
  setContent: (content: string) => void;
  setPhoto: (photo: Photo | undefined) => void;
  setActiveContact: (contact: Contact) => void;
}

const ChooseOptionScreenBase: React.FC<Props> = (props: Props) => {
  const { user } = props.userState;
  return (
    <View style={Styles.screenBackground}>
      <Text style={[Typography.FONT_BOLD, Styles.headerText]}>
        {i18n.t('Compose.chooseAnOption')}
      </Text>
      <Text
        style={[
          Typography.FONT_REGULAR,
          { fontSize: 14, color: Colors.GRAY_DARK, paddingBottom: 10 },
        ]}
      >
        {i18n.t('Compose.psYourLovedOneWillRespondTo')} {user.address1}
        {user.address2 ? ` ${user.address2}` : ''}, {user.city},{' '}
        {STATE_TO_ABBREV[user.state]} {user.postal}.
      </Text>
      <LetterOptionCard
        type={LetterTypes.Postcard}
        onPress={() => {
          Segment.trackWithProperties('Compose - Click on Compose Option', {
            Option: 'Photo',
          });
          if (props.composing.content.length > 0 || props.composing.photo) {
            popupAlert({
              title: i18n.t('Compose.letterInProgress'),
              message: i18n.t('Compose.continueWritingAnd'),
              buttons: [
                {
                  text: i18n.t('Compose.continueWriting'),
                  onPress: () => {
                    let contact: Contact | undefined;
                    for (
                      let ix = 0;
                      ix < props.existingContacts.length;
                      ix += 1
                    ) {
                      if (
                        props.existingContacts[ix].id ===
                        props.composing.recipientId
                      ) {
                        contact = props.existingContacts[ix];
                        break;
                      }
                    }
                    if (contact) {
                      props.setRecipientId(contact.id);
                      props.setActiveContact(contact);
                      props.setType(props.composing.type);
                      if (props.composing.type === LetterTypes.Letter) {
                        props.navigation.navigate('ComposeLetter');
                      } else {
                        props.navigation.navigate('ComposePostcard');
                      }
                    } else {
                      dropdownError({
                        message: i18n.t('Compose.draftContactDeleted'),
                      });
                      props.setType(LetterTypes.Postcard);
                      props.setRecipientId(props.recipientId);
                      props.setContent('');
                      props.setPhoto(undefined);
                      props.navigation.navigate('ComposePostcard');
                    }
                  },
                },
                {
                  text: i18n.t('Compose.startNewLetter'),
                  reverse: true,
                  onPress: () => {
                    props.setType(LetterTypes.Postcard);
                    props.setRecipientId(props.recipientId);
                    props.setContent('');
                    props.setPhoto(undefined);
                    props.navigation.navigate('ComposePostcard');
                  },
                },
              ],
            });
          } else {
            props.setType(LetterTypes.Postcard);
            props.setRecipientId(props.recipientId);
            props.navigation.navigate('ComposePostcard');
          }
        }}
      />
      <LetterOptionCard
        type={LetterTypes.Letter}
        onPress={() => {
          Segment.trackWithProperties('Compose - Click on Compose Option', {
            Option: 'Letter',
          });
          if (props.composing.content.length > 0 || props.composing.photo) {
            popupAlert({
              title: i18n.t('Compose.letterInProgress'),
              message: i18n.t('Compose.continueWritingAnd'),
              buttons: [
                {
                  text: i18n.t('Compose.continueWriting'),
                  onPress: () => {
                    let contact: Contact | undefined;
                    for (
                      let ix = 0;
                      ix < props.existingContacts.length;
                      ix += 1
                    ) {
                      if (
                        props.existingContacts[ix].id ===
                        props.composing.recipientId
                      ) {
                        contact = props.existingContacts[ix];
                        break;
                      }
                    }
                    if (contact) {
                      props.setRecipientId(contact.id);
                      props.setActiveContact(contact);
                      props.setType(props.composing.type);
                      if (props.composing.type === LetterTypes.Letter) {
                        props.navigation.navigate('ComposeLetter');
                      } else {
                        props.navigation.navigate('ComposePostcard');
                      }
                    } else {
                      dropdownError({
                        message: i18n.t('Compose.draftContactDeleted'),
                      });
                      props.setType(LetterTypes.Letter);
                      props.setRecipientId(props.recipientId);
                      props.setContent('');
                      props.setPhoto(undefined);
                      props.navigation.navigate('ComposeLetter');
                    }
                  },
                },
                {
                  text: i18n.t('Compose.startNewLetter'),
                  reverse: true,
                  onPress: () => {
                    props.setType(LetterTypes.Letter);
                    props.setRecipientId(props.recipientId);
                    props.setContent('');
                    props.setPhoto(undefined);
                    props.navigation.navigate('ComposeLetter');
                  },
                },
              ],
            });
          } else {
            props.setType(LetterTypes.Letter);
            props.setRecipientId(props.recipientId);
            props.navigation.navigate('ComposeLetter');
          }
        }}
      />
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  composing: state.letter.composing,
  userState: state.user,
  recipientId: state.contact.active.id,
  existingContacts: state.contact.existing,
});
const mapDispatchToProps = (
  dispatch: Dispatch<LetterActionTypes | ContactActionTypes>
) => {
  return {
    setType: (type: LetterTypes) => dispatch(setType(type)),
    setRecipientId: (id: number) => dispatch(setRecipientId(id)),
    setContent: (content: string) => dispatch(setContent(content)),
    setPhoto: (photo: Photo | undefined) => dispatch(setPhoto(photo)),
    setActiveContact: (contact: Contact) => dispatch(setActiveContact(contact)),
  };
};
const ChooseOptionScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseOptionScreenBase);

export default ChooseOptionScreen;
