import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image as ImageComponent,
} from 'react-native';
import { Image } from 'types';

interface Props {
  onUpload: (image: Image) => void;
  onDelete: () => void;
  image: Image;
}

const ImageUpload: React.FC<Props> = (props: Props) => {
  return (
    <View>
      <Text>Hello Hello</Text>
    </View>
  );
};
