import React from "react";
import { SvgXml } from "react-native-svg";
import { ViewStyle } from "react-native";

interface Props {
  svg: string;
  style?: ViewStyle;
}

const Icon: React.FC<Props> = (props) => {
  return <SvgXml xml={props.svg} style={props.style} />;
};

export default Icon;
