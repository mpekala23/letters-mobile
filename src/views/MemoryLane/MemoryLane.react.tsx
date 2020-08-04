import React, { Dispatch } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Letter } from 'types';
import MemoryLaneCard from '@components/Card/MemoryLaneCard.react';
import { connect } from 'react-redux';
import { Contact } from '@store/Contact/ContactTypes';
import { AppState } from '@store/types';
import { setActive as setActiveLetter } from '@store/Letter/LetterActions';
import i18n from '@i18n';
import { LetterActionTypes } from '@store/Letter/LetterTypes';
import * as Segment from 'expo-analytics-segment';
import Styles from './MemoryLane.styles';

type MemoryLaneScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'MemoryLane'
>;

interface Props {
  navigation: MemoryLaneScreenNavigationProp;
  contact: Contact;
  existingLetters: Record<number, Letter[]>;
  setActiveLetter: (letter: Letter) => void;
}

const MemoryLaneScreenBase: React.FC<Props> = (props: Props) => {
  const letters = props.existingLetters[props.contact.id];
  const memoryCards =
    letters && letters.length > 0 ? (
      letters.map((letter: Letter) => {
        return (
          <MemoryLaneCard
            type={letter.type}
            key={letter.letterId}
            text={letter.content}
            date={letter.dateCreated}
            imageUri={letter.photo ? letter.photo.uri : ''}
            onPress={() => {
              props.setActiveLetter(letter);
              Segment.track('Memory Lane - Click on Memory Card');
              props.navigation.navigate('LetterDetails');
            }}
            style={{ width: '45%', marginLeft: 6 }}
          />
        );
      })
    ) : (
      <View style={{ alignItems: 'center' }}>
        <Text style={Styles.baseText}>
          {i18n.t('MemoryLaneScreen.youDoNotHaveLettersYet')}
        </Text>
        <Text style={Styles.baseText}>
          {' '}
          {i18n.t('MemoryLaneScreen.goSendYourFirstLetter')}
        </Text>
      </View>
    );

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: '#EDEDED' }}
    >
      <View
        style={
          letters && letters.length > 0
            ? Styles.cardsBackground
            : Styles.textBackground
        }
      >
        {memoryCards}
      </View>
    </ScrollView>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    contact: state.contact.active,
    existingLetters: state.letter.existing,
  };
};
const mapDispatchToProps = (dispatch: Dispatch<LetterActionTypes>) => {
  return {
    setActiveLetter: (letter: Letter) => dispatch(setActiveLetter(letter)),
  };
};

const MemoryLaneScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(MemoryLaneScreenBase);

export default MemoryLaneScreen;
