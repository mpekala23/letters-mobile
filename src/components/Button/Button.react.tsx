import React from "react";
import { TouchableOpacity, Text } from "react-native";
import PropTypes from "prop-types";
import Styles from "./Button.styles";
import { Typography } from "@styles";
import { StyleType } from "@utils";

export interface Props {
  containerStyle?: object;
  textStyle?: object;
  buttonText: string;
  reverse?: boolean;
  link?: boolean;
  onPress?: () => void;
}

const Button: React.FC<Props> = (props) => {
  const {
    containerStyle,
    onPress,
    textStyle,
    buttonText,
    reverse,
    link,
  } = props;
  if (!link) {
    return (
      <TouchableOpacity
        style={[
          reverse ? Styles.buttonBackgroundReverse : Styles.buttonBackground,
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
  } else {
    return (
      <TouchableOpacity onPress={onPress}>
        <Text style={[Typography.FONT_REGULAR, Styles.linkText]}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    );
  }
};

Button.propTypes = {
  containerStyle: StyleType,
  textStyle: StyleType,
  buttonText: PropTypes.string.isRequired,
  reverse: PropTypes.bool,
  link: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
};

Button.defaultProps = {
  containerStyle: {},
  textStyle: {},
  reverse: false,
  link: false,
  onPress: () => {},
};

export default Button;
