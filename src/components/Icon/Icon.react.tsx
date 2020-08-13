import React from 'react';
import { SvgXml } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface Props {
  svg: string;
  style?: ViewStyle;
  scale?: number;
}

const Icon: React.FC<Props> = (props: Props) => {
  const { svg, style } = props;
  return <SvgXml xml={svg} style={style} scale={props.scale} width={2000} />;
};

Icon.defaultProps = {
  style: {},
  scale: 1,
};

export default Icon;
