import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, ProfilePic } from '@components';
import { AppStackParamList } from 'navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Contact } from '@store/Contact/ContactTypes';
import { Colors, Typography } from '@styles';
import { ProfilePicTypes, Letter } from 'types';
import LetterStatusCard from '@components/Card/LetterStatusCard.react';
import MemoryLaneCountCard from 'components/Card/MemoryLaneCountCard.react';
import Styles from './SingleContact.styles';

type SingleContactScreenNavigationProp = StackNavigationProp<AppStackParamList, 'SingleContact'>;

interface Props {
  navigation: SingleContactScreenNavigationProp;
  route: {
    params: { contact: Contact; letters?: Letter[] };
  };
}

const SingleContactScreen: React.FC<Props> = (props) => {
  const { contact, letters } = props.route.params;

  const letterCards =
    letters && letters.length > 0
      ? letters.map((letter: Letter, key: number) => {
          return (
            <LetterStatusCard
              status={letter.status}
              date='05/11/2020'
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
        <View style={Styles.profileCardHeader} />
        <ProfilePic
          firstName={contact.firstName}
          lastName={contact.lastName}
          imageUri='ExamplePic'
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
          {/* eslint-disable-line jsx-a11y/accessible-emoji */}
          💌 received: {letters ? letters.length : 0}
        </Text>
        <Text style={[Typography.FONT_REGULAR, Styles.profileCardInfo]}>
          {/* eslint-disable-line jsx-a11y/accessible-emoji */}
          📅 last heard from you:
        </Text>
        <Text style={[Typography.FONT_REGULAR, Styles.profileCardInfo, { paddingBottom: 4 }]}>
          {/* eslint-disable-line jsx-a11y/accessible-emoji */}
          ✈️ letters traveled:
        </Text>
        <Button
          onPress={() => props.navigation.navigate('ChooseOption')}
          buttonText="Send letter"
          textStyle={{ fontSize: 20 }}
          containerStyle={Styles.sendLetterButton}
        />
      </View>
      <ScrollView style={Styles.actionItems} keyboardShouldPersistTaps='handled'>
        <MemoryLaneCountCard
          letterCount={letters ? letters.length : 0}
          onPress={() => {
            /* TO-DO: Navigate to memory lane screen */
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
          Letter Tracking
        </Text>
        {letterCards}
      </ScrollView>
    </View>
  );
};

export default SingleContactScreen;
