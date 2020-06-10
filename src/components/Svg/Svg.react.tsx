import React from "react";
import { SvgXml } from "react-native-svg";

interface Props {
  svg: string;
  style?: object;
}

const Svg: React.FC<Props> = (props) => {
  return <SvgXml xml={props.svg} style={props.style} />;
};

export default Svg;
