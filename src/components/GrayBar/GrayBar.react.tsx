import React from 'react';
import { View } from 'react-native';
import Styles from './GrayBar.styles';

interface Props {
  vertical?: boolean;
}

const GrayBar: React.FC<Props> = (props: Props) => {
  return (
    <View style={props.vertical ? Styles.verticalGrayBar : Styles.grayBar} />
  );
};

GrayBar.defaultProps = {
  vertical: false,
};

export default GrayBar;
