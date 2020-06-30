import React, { Dispatch } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, ProfilePic } from '@components';
import { AppStackParamList } from 'navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Contact } from '@store/Contact/ContactTypes';
import { Colors, Typography } from '@styles';
import { ProfilePicTypes, Letter } from 'types';
import LetterStatusCard from '@components/Card/LetterStatusCard.react';
import MemoryLaneCountCard from 'components/Card/MemoryLaneCountCard.react';
import Emoji from 'react-native-emoji';
import i18n from '@i18n';
import { connect } from 'react-redux';
import { setActive } from '@store/Letter/LetterActions';
import { LetterActionTypes } from '@store/Letter/LetterTypes';
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
                props.setActiveLetter(letter);
                props.navigation.navigate('LetterTracking');
              }}
              key={letter.letterId}
            />
          );
        })
      : null;

  return (
    <View style={Styles.trueBackground}>
      <View style={Styles.profileCard}>
        <View style={Styles.profileCardHeader} />
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
            /* TO-DO: Navigate to memory lane screen */
          }}
        />
        <Text
          style={[
            Typography.BASE_TITLE,
            {
              color: Colors.GRAY_DARKER,
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

const mapDispatchToProps = (dispatch: Dispatch<LetterActionTypes>) => {
  return {
    setActiveLetter: (letter: Letter) => dispatch(setActive(letter)),
  };
};
const SingleContactScreen = connect(
  null,
  mapDispatchToProps
)(SingleContactScreenBase);

export default SingleContactScreen;
