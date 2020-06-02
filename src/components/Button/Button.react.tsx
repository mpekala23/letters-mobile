import React from "react";
import { TouchableOpacity, Text } from "react-native";
import PropTypes from "prop-types";
import Styles from "./Button.styles";
import { Typography } from "@styles";
import { StyleType } from "@utils";

export interface Props {
  containerStyle?: object;
  textStyle?: object;
  disabledContainerStyle?: object;
  disabledTextStyle?: object;
  buttonText?: string;
  reverse?: boolean;
  link?: boolean;
  enabled?: boolean;
  onPress: () => void;
}

const Button: React.FC<Props> = (props) => {
  const {
    containerStyle,
    disabledContainerStyle,
    disabledTextStyle,
    onPress,
    textStyle,
    buttonText,
    reverse,
    link,
    enabled,
  } = props;
  if (!link) {
    return (
      <TouchableOpacity
        style={[
          reverse ? Styles.buttonBackgroundReverse : Styles.buttonBackground,
          enabled ? {} : Styles.buttonBackgroundDisabled,
          containerStyle,
          enabled ? {} : disabledContainerStyle,
        ]}
        activeOpacity={enabled ? 0.7 : 1.0}
        onPress={() => {
          if (enabled) {
            onPress();
          }
        }}
      >
        <Text
          style={[
            props.reverse ? Styles.buttonTextReverse : Styles.buttonText,
            enabled ? {} : Styles.buttonTextDisabled,
            textStyle,
            enabled ? {} : disabledTextStyle,
          ]}
        >
          {buttonText}
        </Text>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        onPress={() => {
          if (enabled) {
            onPress();
          }
        }}
        style={containerStyle}
      >
        <Text style={[Typography.FONT_REGULAR, Styles.linkText]}>
          {buttonText || props.children}
        </Text>
      </TouchableOpacity>
    );
  }
};

Button.propTypes = {
  containerStyle: StyleType,
  textStyle: StyleType,
  disabledContainerStyle: StyleType,
  disabledTextStyle: StyleType,
  buttonText: PropTypes.string,
  reverse: PropTypes.bool,
  link: PropTypes.bool,
  enabled: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
};

Button.defaultProps = {
  containerStyle: {},
  textStyle: {},
  disabledContainerStyle: {},
  disabledTextStyle: {},
  reverse: false,
  link: false,
  enabled: true,
  onPress: () => {},
};

export default Button;
