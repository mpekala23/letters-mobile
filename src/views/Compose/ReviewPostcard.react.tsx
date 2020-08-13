import React from 'react';
import { TouchableOpacity, View, Keyboard } from 'react-native';
import { StaticPostcard } from '@components';
import { WINDOW_HEIGHT } from '@utils';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import Styles from './Compose.styles';

type ReviewPostcardScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ReviewPostcard'
>;

export interface Props {
  navigation: ReviewPostcardScreenNavigationProp;
}

const ReviewPostcard: React.FC<Props> = (props: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={1.0}
      style={Styles.gridTrueBackground}
      onPress={Keyboard.dismiss}
    >
      <View
        style={[
          Styles.gridPreviewBackground,
          {
            position: 'absolute',
            top: (WINDOW_HEIGHT * 2) / 5,
          },
        ]}
      >
        <StaticPostcard content="hello" />
      </View>
    </TouchableOpacity>
  );
};

export default ReviewPostcard;
