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
              paddingTop: 18,
            },
          ]}
        >
          <View style={[{ paddingTop: 8 }]}>
            <ProfilePic
              firstName={contact.firstName}
              lastName={contact.lastName}
              type={ProfilePicTypes.Contact}
            />
          </View>
        </View>
        <View style={[{ paddingLeft: 112 }]}>
          <Text
            style={[
              Typography.FONT_BOLD,
              {
                color: Colors.AMEELIO_BLACK,
                fontSize: 22,
                paddingBottom: 8,
              },
            ]}
          >
            {contact.firstName}
          </Text>
          <Text style={(Typography.FONT_REGULAR, Styles.contactCardInfo)}>
            <Emoji name="love_letter" style={{ fontSize: 16 }} /> received:
          </Text>
          <Text style={(Typography.FONT_REGULAR, Styles.contactCardInfo)}>
            <Emoji name="calendar" style={{ fontSize: 16 }} /> last heard from
            you:
          </Text>
          <Text
            style={[
              Typography.FONT_REGULAR,
              Styles.contactCardInfo,
              { paddingBottom: 16 },
            ]}
          >
            <Emoji name="airplane" style={{ fontSize: 16 }} /> letters traveled:
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
        YOUR LOVED ONES
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
