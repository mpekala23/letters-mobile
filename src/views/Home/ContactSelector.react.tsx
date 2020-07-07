import React from 'react';
import {
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Icon } from '@components';
import { AppStackParamList } from 'navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography } from '@styles';
import { AppState } from '@store/types';
import { Contact } from '@store/Contact/ContactTypes';
import { connect } from 'react-redux';
import { Letter } from 'types';
import i18n from '@i18n';
import AddContact from '@assets/views/ContactSelector/AddContact';
import ContactSelectorCard from '@components/Card/ContactSelectorCard.react';
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
      <ContactSelectorCard
        firstName={contact.firstName}
        lastName={contact.lastName}
        letters={props.existingLetters[contact.id]}
        onPress={() => {
          props.navigation.navigate('SingleContact', {
            contact,
            letters: props.existingLetters[contact.id],
          });
        }}
        key={contact.inmateNumber}
      />
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
            color: Colors.GRAY_DARK,
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
      <TouchableOpacity
        style={Styles.addContactButton}
        onPress={() => {
          props.navigation.navigate('ContactInfo', { addFromSelector: true });
        }}
        testID="addContact"
      >
        <Icon svg={AddContact} style={{ marginTop: 13, marginRight: 2 }} />
      </TouchableOpacity>
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
