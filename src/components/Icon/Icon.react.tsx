import React from 'react';
import { SvgXml } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface Props {
  svg: string;
  style?: ViewStyle;
}

const Icon: React.FC<Props> = (props: Props) => {
  const { svg, style } = props;
  return <SvgXml xml={svg} style={style} />;
};

Icon.defaultProps = {
  style: {},
};

export default Icon;
