import React from "react";
import { TouchableOpacity, Text } from "react-native";
import PropTypes from "prop-types";
import Styles from "./Button.styles";

export interface Props {
  containerStyle?: object;
  textStyle?: object;
  buttonText: string;
  reverse?: boolean;
  onPress?: () => void;
}

const Button: React.FC<Props> = (props) => {
  const { containerStyle, onPress, textStyle, buttonText } = props;
  return (
    <TouchableOpacity
      style={[
        props.reverse
          ? Styles.buttonBackgroundReverse
          : Styles.buttonBackground,
        containerStyle,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          props.reverse ? Styles.buttonTextReverse : Styles.buttonText,
          textStyle,
        ]}
      >
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  containerStyle: PropTypes.objectOf(PropTypes.string),
  textStyle: PropTypes.objectOf(PropTypes.string),
  buttonText: PropTypes.string.isRequired,
  reverse: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
};

Button.defaultProps = {
  containerStyle: {},
  textStyle: {},
  reverse: false,
  onPress: () => {},
};

export default Button;
