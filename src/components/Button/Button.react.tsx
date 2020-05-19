import React from "react";
import { TouchableOpacity, Text } from "react-native";
import PropTypes from "prop-types";
import Styles from "./Button.styles";

export interface Props {
  containerStyle?: object;
  textStyle?: object;
  buttonText: string;
  onPress?: () => void;
}

const Button: React.FC<Props> = (props) => {
  const { containerStyle, onPress, textStyle, buttonText } = props;
  return (
    <TouchableOpacity
      style={[Styles.buttonBackground, containerStyle]}
      onPress={onPress}
    >
      <Text style={[Styles.buttonText, textStyle]}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  containerStyle: PropTypes.objectOf(PropTypes.string),
  textStyle: PropTypes.objectOf(PropTypes.string),
  buttonText: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

Button.defaultProps = {
  containerStyle: {},
  textStyle: {},
  onPress: () => {},
};

export default Button;
