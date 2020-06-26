import React from 'react';
import { ScrollView, View } from 'react-native';
import { AppStackParamList } from 'navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Letter } from 'types';
import MemoryLaneCard from '@components/Card/MemoryLaneCard.react';
import { connect } from 'react-redux';
import { Contact } from 'store/Contact/ContactTypes';
import { AppState } from '@store/types';
import Styles from './MemoryLane.styles';

type MemoryLaneScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'MemoryLane'
>;

interface Props {
  navigation: MemoryLaneScreenNavigationProp;
  contact: Contact;
  existingLetters: Record<number, Letter[]>;
}

const MemoryLaneScreenBase: React.FC<Props> = (props: Props) => {
  const letters = props.existingLetters[props.contact.id];
  const memoryCards =
    letters && letters.length > 0
      ? letters.map((letter: Letter) => {
          return (
            <MemoryLaneCard
              key={letter.letterId}
              text={letter.message}
              date="05/11/2020"
              imageUri={letter.photoPath ? letter.photoPath : ''}
              onPress={() => {
                /* TO-DO: Navigate to letter review screen (reusable from compose flow) */
              }}
              style={{ width: '45%', marginLeft: 6 }}
            />
          );
        })
      : null; // TO-DO: Add zeroth state when unblocked by design

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: '#EDEDED' }}
    >
      <View style={Styles.trueBackground}>{memoryCards}</View>
    </ScrollView>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    contact: state.contact.active,
    existingLetters: state.letter.existing,
  };
};

const MemoryLaneScreen = connect(mapStateToProps)(MemoryLaneScreenBase);

export default MemoryLaneScreen;
