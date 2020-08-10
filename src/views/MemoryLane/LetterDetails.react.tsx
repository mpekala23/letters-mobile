import React from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Letter, LetterTypes, LetterStatus } from 'types';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { format } from 'date-fns';
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
  const letterDate = format(
    letter.dateCreated ? letter.dateCreated : new Date(),
    'MMM dd, yyyy'
  );
  const photos = letter.photo?.uri ? (
    <Image
      style={Styles.memoryLanePicture}
      source={letter.photo}
      testID="memoryLaneImage"
    />
  ) : null;
  return (
    <View
      style={[
        Styles.trueBackground,
        { backgroundColor: props.navigation ? undefined : '' },
      ]}
    >
      <View style={Styles.letterDate}>
        <Text style={Styles.baseText}>{letterDate}</Text>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={Styles.letterText}>{letter.content}</Text>
        {photos}
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  letter: state.letter.active
    ? state.letter.active
    : {
        type: LetterTypes.Postcard,
        status: LetterStatus.Draft,
        isDraft: true,
        recipientId: -1,
        recipientName: '',
        content: '',
        trackingEvents: [],
      },
});

const LetterDetailsScreen = connect(mapStateToProps)(LetterDetailsScreenBase);

export default LetterDetailsScreen;
