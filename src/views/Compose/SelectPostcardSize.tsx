import { AsyncImage } from '@components';
import React from 'react';
import { View, Text } from 'react-native';
import Styles from './SelectPostcardSize.styles';

// interface Props {}

const SelectPostcardSize = () => {
  const renderItem = () => {
    return (
      <View>
        <AsyncImage download source={} />
      </View>
    );
  };
  return (
    <View style={Styles.trueBackground}>
      <View>
        <AsyncImage download source={} />
      </View>
    </View>
  );
};

export default SelectPostcardSize;
