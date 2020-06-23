import React from 'react';
import { Text, View } from 'react-native';
import { AppStackParamList } from 'navigations';
import { StackNavigationProp } from '@react-navigation/stack';

type UpdateContactScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'UpdateContact'
>;

export interface Props {
  navigation: UpdateContactScreenNavigationProp;
}

const UpdateContactScreen: React.FC<Props> = () => {
  return (
    <View>
      <Text>update info screen</Text>
    </View>
  );
};

export default UpdateContactScreen;
