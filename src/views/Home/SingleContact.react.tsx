import React, { Dispatch } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Button, ProfilePic } from '@components';
import { AppStackParamList } from 'navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Contact, ContactActionTypes } from '@store/Contact/ContactTypes';
import { Colors, Typography } from '@styles';
import { ProfilePicTypes, Letter } from 'types';
import LetterStatusCard from '@components/Card/LetterStatusCard.react';
import MemoryLaneCountCard from 'components/Card/MemoryLaneCountCard.react';
import Emoji from 'react-native-emoji';
import i18n from '@i18n';
import PencilIcon from '@assets/components/Card/Pencil';
import Icon from '@components/Icon/Icon.react';
import { connect } from 'react-redux';
import { setActive } from '@store/Contact/ContactActions';
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
  setActive: (contact: Contact) => void;
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
                /* TO-DO: Navigate to letter tracking screen */
              }}
              key={letter.letterId}
            />
          );
        })
      : null;

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
              props.setActive(contact);
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
              paddingBottom: 4,
            },
          ]}
        >
          {contact.firstName} {contact.lastName}
        </Text>
        <Text style={[Typography.FONT_REGULAR, Styles.profileCardInfo]}>
          <Emoji name="love_letter" style={{ fontSize: 16 }} />{' '}
          {i18n.t('SingleContactScreen.received')}:{' '}
          {letters ? letters.length : 0}
        </Text>
        <Text style={[Typography.FONT_REGULAR, Styles.profileCardInfo]}>
          <Emoji name="calendar" style={{ fontSize: 16 }} />{' '}
          {i18n.t('SingleContactScreen.lastHeardFromYou')}:
        </Text>
        <Text
          style={[
            Typography.FONT_REGULAR,
            Styles.profileCardInfo,
            { paddingBottom: 4 },
          ]}
        >
          <Emoji name="airplane" style={{ fontSize: 16 }} />{' '}
          {i18n.t('SingleContactScreen.lettersTraveled')}:
        </Text>
        <Button
          onPress={() => props.navigation.navigate('ChooseOption')}
          buttonText={i18n.t('SingleContactScreen.sendLetter')}
          textStyle={{ fontSize: 20 }}
          containerStyle={Styles.sendLetterButton}
        />
      </View>
      <ScrollView
        style={Styles.actionItems}
        keyboardShouldPersistTaps="handled"
      >
        <MemoryLaneCountCard
          letterCount={letters ? letters.length : 0}
          onPress={() => {
            props.setActive(contact);
            props.navigation.navigate('MemoryLane');
          }}
        />
        <Text
          style={[
            Typography.FONT_BOLD,
            {
              color: Colors.GRAY_DARKER,
              fontSize: 20,
              paddingTop: 24,
            },
          ]}
        >
          {i18n.t('SingleContactScreen.letterTracking')}
        </Text>
        {letterCards}
      </ScrollView>
    </View>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<ContactActionTypes>) => {
  return {
    setActive: (contact: Contact) => dispatch(setActive(contact)),
  };
};
const SingleContactScreen = connect(
  null,
  mapDispatchToProps
)(SingleContactScreenBase);

export default SingleContactScreen;
