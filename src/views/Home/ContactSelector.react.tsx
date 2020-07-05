import React from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Button, ProfilePic } from '@components';
import { AppStackParamList } from 'navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography } from '@styles';
import { AppState } from '@store/types';
import { Contact } from '@store/Contact/ContactTypes';
import { connect } from 'react-redux';
import { ProfilePicTypes, Letter } from 'types';
import Emoji from 'react-native-emoji';
import i18n from '@i18n';
import Styles from './ContactSelector.styles';

type ContactSelectorScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ContactSelector'
>;

interface Props {
  existingContacts: Contact[];
  existingLetters: Record<number, Letter[]>;
  navigation: ContactSelectorScreenNavigationProp;
}

const ContactSelectorScreenBase: React.FC<Props> = (props: Props) => {
  const contactSelectorList = props.existingContacts.map((contact: Contact) => {
    return (
      <TouchableOpacity
        style={Styles.contactCard}
        onPress={() => {
          props.navigation.navigate('SingleContact', {
            contact,
            letters: props.existingLetters[contact.id],
          });
        }}
        key={contact.inmateNumber}
      >
        <View
          style={[
            {
              flex: 1,
              flexDirection: 'row',
              paddingLeft: 16,
            },
          ]}
        >
          <View style={[{ paddingTop: 24 }]}>
            <ProfilePic
              firstName={contact.firstName}
              lastName={contact.lastName}
              type={ProfilePicTypes.Contact}
            />
          </View>
        </View>
        <View style={[{ paddingLeft: 112 }]}>
          <Text style={[Typography.BASE_TITLE]}>{contact.firstName}</Text>
          <Text style={[Typography.FONT_MEDIUM, Styles.contactCardInfo]}>
            <Emoji name="love_letter" />{' '}
            {i18n.t('SingleContactScreen.received')}:{' '}
          </Text>
          <Text style={[Typography.FONT_MEDIUM, Styles.contactCardInfo]}>
            <Emoji name="calendar" />{' '}
            {i18n.t('SingleContactScreen.lastHeardFromYou')}:
          </Text>
          <Text
            style={[
              Typography.FONT_MEDIUM,
              Styles.contactCardInfo,
              { paddingBottom: 4 },
            ]}
          >
            <Emoji name="airplane" />{' '}
            {i18n.t('SingleContactScreen.lettersTraveled')}:
          </Text>
        </View>
      </TouchableOpacity>
    );
  });
  return (
    <KeyboardAvoidingView
      style={Styles.trueBackground}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
    >
      <Text
        style={[
          Typography.FONT_BOLD,
          {
            color: Colors.GRAY_DARKER,
            fontSize: 20,
            paddingBottom: 16,
          },
        ]}
      >
        {i18n.t('ContactSelectorScreen.yourLovedOnes')}
      </Text>
      <ScrollView keyboardShouldPersistTaps="handled">
        {contactSelectorList}
      </ScrollView>
      <View style={{ alignItems: 'flex-end' }}>
        <Button
          onPress={() => {
            props.navigation.navigate('ContactInfo', { addFromSelector: true });
          }}
          buttonText="+"
          textStyle={{ fontSize: 30 }}
          containerStyle={Styles.addContactButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    existingContacts: state.contact.existing,
    existingLetters: state.letter.existing,
  };
};

const ContactSelectorScreen = connect(mapStateToProps)(
  ContactSelectorScreenBase
);

export default ContactSelectorScreen;
