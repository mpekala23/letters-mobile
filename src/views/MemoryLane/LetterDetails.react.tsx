import React from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import { AppStackParamList } from 'navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Letter } from 'types';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import Styles from './LetterDetails.styles';

type LetterDetailsScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'LetterDetails'
>;

interface Props {
  navigation: LetterDetailsScreenNavigationProp;
  letter: Letter;
}

const LetterDetailsScreenBase: React.FC<Props> = (props: Props) => {
  const { letter } = props;
  const photos = letter.photoPath ? (
    <Image
      style={Styles.memoryLanePicture}
      source={{
        uri: letter.photoPath,
      }}
      testID="memoryLaneImage"
    />
  ) : null;
  return (
    <View style={Styles.trueBackground}>
      <View style={Styles.letterDate}>
        <Text style={Styles.baseText}>{letter.dateCreated}</Text>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={Styles.letterText}>{letter.message}</Text>
        {photos}
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  letter: state.letter.active,
});

const LetterDetailsScreen = connect(mapStateToProps)(LetterDetailsScreenBase);

export default LetterDetailsScreen;
