import React, { Dispatch } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Button, ProfilePic } from '@components';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Contact, ContactActionTypes } from '@store/Contact/ContactTypes';
import { Colors, Typography } from '@styles';
import { ProfilePicTypes, Letter } from 'types';
import CreditsCard from '@components/Card/CreditsCard.react';
import LetterStatusCard from '@components/Card/LetterStatusCard.react';
import MemoryLaneCountCard from '@components/Card/MemoryLaneCountCard.react';
import Emoji from 'react-native-emoji';
import i18n from '@i18n';
import { setActive as setActiveLetter } from '@store/Letter/LetterActions';
import { LetterActionTypes } from '@store/Letter/LetterTypes';
import PencilIcon from '@assets/components/Card/Pencil';
import Icon from '@components/Icon/Icon.react';
import { connect } from 'react-redux';
import { setActive as setActiveContact } from '@store/Contact/ContactActions';
import { LinearGradient } from 'expo-linear-gradient';
import Styles from './SingleContact.styles';

type SingleContactScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'SingleContact'
>;

interface Props {
  navigation: SingleContactScreenNavigationProp;
  route: {
    params: { contact: Contact; letters?: Letter[] };
  };
  setActiveLetter: (letter: Letter) => void;
  setActiveContact: (contact: Contact) => void;
}

const SingleContactScreenBase: React.FC<Props> = (props: Props) => {
  const { contact, letters } = props.route.params;

  const letterCards =
    letters && letters.length > 0
      ? letters.map((letter: Letter) => {
          return (
            <LetterStatusCard
              status={letter.status}
              date="05/11/2020"
              description={letter.message}
              onPress={() => {
                props.setActiveLetter(letter);
                props.navigation.navigate('LetterTracking');
              }}
              key={letter.letterId}
            />
          );
        })
      : null;

  const letterTrackingTitle =
    letters && letters.length > 0 ? (
      <Text
        style={[
          Typography.BASE_TITLE,
          {
            color: Colors.GRAY_DARK,
            paddingTop: 12,
          },
        ]}
      >
        {i18n.t('SingleContactScreen.letterTracking')}
      </Text>
    ) : null;

  return (
    <View style={Styles.trueBackground}>
      <View style={Styles.profileCard}>
        <LinearGradient
          colors={['#ADD3FF', '#FFC9C9']}
          style={Styles.profileCardHeader}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity
            onPress={() => {
              props.setActiveContact(contact);
              props.navigation.navigate('UpdateContact');
            }}
          >
            <Icon
              svg={PencilIcon}
              style={{ position: 'absolute', top: 8, right: 12 }}
            />
          </TouchableOpacity>
        </LinearGradient>
        <ProfilePic
          firstName={contact.firstName}
          lastName={contact.lastName}
          imageUri="ExamplePic"
          type={ProfilePicTypes.SingleContact}
        />
        <Text
          style={[
            Typography.FONT_BOLD,
            {
              color: Colors.AMEELIO_BLACK,
              fontSize: 25,
            },
          ]}
        >
          {contact.firstName} {contact.lastName}
        </Text>
        <Text style={[Typography.FONT_MEDIUM, Styles.profileCardInfo]}>
          <Emoji name="love_letter" /> {i18n.t('SingleContactScreen.received')}:{' '}
          {letters ? letters.length : 0}
        </Text>
        <Text style={[Typography.FONT_MEDIUM, Styles.profileCardInfo]}>
          <Emoji name="calendar" />{' '}
          {i18n.t('SingleContactScreen.lastHeardFromYou')}:
        </Text>
        <Text style={[Typography.FONT_MEDIUM, Styles.profileCardInfo]}>
          <Emoji name="airplane" />{' '}
          {i18n.t('SingleContactScreen.lettersTraveled')}:
        </Text>
        <Button
          onPress={() => {
            props.setActiveContact(contact);
            props.navigation.navigate('ChooseOption');
          }}
          buttonText={i18n.t('SingleContactScreen.sendLetter')}
          textStyle={(Typography.FONT_BOLD, { fontSize: 20 })}
          containerStyle={Styles.sendLetterButton}
        />
      </View>
      <ScrollView
        style={Styles.actionItems}
        keyboardShouldPersistTaps="handled"
      >
        <CreditsCard
          credits={contact.credit}
          onPress={() => {
            /* Navigate to Add More credits flow */
          }}
        />
        <MemoryLaneCountCard
          letterCount={letters ? letters.length : 0}
          onPress={() => {
            props.setActiveContact(contact);
            props.navigation.navigate('MemoryLane');
          }}
        />
        {letterTrackingTitle}
        {letterCards}
      </ScrollView>
    </View>
  );
};

const mapDispatchToProps = (
  dispatch: Dispatch<LetterActionTypes | ContactActionTypes>
) => {
  return {
    setActiveContact: (contact: Contact) => dispatch(setActiveContact(contact)),
    setActiveLetter: (letter: Letter) => dispatch(setActiveLetter(letter)),
  };
};
const SingleContactScreen = connect(
  null,
  mapDispatchToProps
)(SingleContactScreenBase);

export default SingleContactScreen;
