import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import { Typography } from '@styles';
import { StyleType } from '@utils';
import Styles from './Button.styles';

export interface Props {
  containerStyle?: Record<string, unknown>;
  textStyle?: Record<string, unknown>;
  disabledContainerStyle?: Record<string, unknown>;
  disabledTextStyle?: Record<string, unknown>;
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
    children,
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
        testID="clickable"
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
  }
  return (
    <TouchableOpacity
      onPress={() => {
        if (enabled) {
          onPress();
        }
      }}
      style={containerStyle}
      testID="clickable"
    >
      <Text style={[Typography.FONT_REGULAR, Styles.linkText]}>
        {buttonText || children}
      </Text>
    </TouchableOpacity>
  );
};

Button.defaultProps = {
  containerStyle: {},
  textStyle: {},
  disabledContainerStyle: {},
  disabledTextStyle: {},
  reverse: false,
  link: false,
  enabled: true,
  onPress: () => {
    /* nothing */
  },
};

export default Button;
