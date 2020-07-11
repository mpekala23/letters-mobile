import React, { Dispatch, useState } from 'react';
import {
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  FlatList,
} from 'react-native';
import { Icon } from '@components';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography } from '@styles';
import { AppState } from '@store/types';
import { Contact, ContactActionTypes } from '@store/Contact/ContactTypes';
import { connect } from 'react-redux';
import { Letter } from 'types';
import i18n from '@i18n';
import AddContact from '@assets/views/ContactSelector/AddContact';
import ContactSelectorCard from '@components/Card/ContactSelectorCard.react';
import { setActive } from '@store/Contact/ContactActions';
import { getContacts } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import Styles from './ContactSelector.styles';

type ContactSelectorScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ContactSelector'
>;

interface Props {
  existingContacts: Contact[];
  existingLetters: Record<number, Letter[]>;
  navigation: ContactSelectorScreenNavigationProp;
  setActiveContact: (contact: Contact) => void;
}

const ContactSelectorScreenBase: React.FC<Props> = (props: Props) => {
  const [refreshing, setRefreshing] = useState(false);

  const renderItem = ({ item }: { item: Contact }): JSX.Element => {
    return (
      <ContactSelectorCard
        firstName={item.firstName}
        lastName={item.lastName}
        letters={props.existingLetters[item.id]}
        onPress={() => {
          props.setActiveContact(item);
          props.navigation.navigate('SingleContact', {
            contact: item,
            letters: props.existingLetters[item.id],
          });
        }}
        key={item.inmateNumber}
      />
    );
  };
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
      <FlatList
        data={props.existingContacts}
        renderItem={renderItem}
        onRefresh={async () => {
          setRefreshing(true);
          try {
            await getContacts();
          } catch (e) {
            dropdownError({ message: i18n.t('Error.cantRefreshContacts') });
          }
          setRefreshing(false);
        }}
        refreshing={refreshing}
      />
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
const mapDispatchToProps = (dispatch: Dispatch<ContactActionTypes>) => {
  return {
    setActiveContact: (contact: Contact) => dispatch(setActive(contact)),
  };
};
const ContactSelectorScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactSelectorScreenBase);

export default ContactSelectorScreen;
