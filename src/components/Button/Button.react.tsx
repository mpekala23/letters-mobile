import React from 'react';
import {
  TouchableOpacity,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Typography } from '@styles';
import Next from '@assets/components/Button/Next';
import { SvgXml } from 'react-native-svg';
import Styles from './Button.styles';

export interface Props {
  containerStyle?: ViewStyle | ViewStyle[];
  textStyle?: Record<string, unknown> | TextStyle | TextStyle[];
  disabledContainerStyle?: Record<string, unknown>;
  disabledTextStyle?: Record<string, unknown>;
  buttonText?: string;
  reverse?: boolean;
  link?: boolean;
  enabled?: boolean;
  onPress: () => void;
  children?: JSX.Element;
  showNextIcon?: boolean;
}

const Button: React.FC<Props> = (props: Props) => {
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
    showNextIcon,
  } = props;
  const nextIcon = showNextIcon ? (
    <View style={{ position: 'absolute', right: 12 }} testID="nextIcon">
      <SvgXml xml={Next} />
    </View>
  ) : null;
  if (!link) {
    return (
      <TouchableOpacity
        style={[
          reverse ? Styles.buttonBackgroundReverse : Styles.buttonBackground,
          enabled ? {} : Styles.buttonBackgroundDisabled,
          containerStyle,
          enabled ? {} : disabledContainerStyle,
          Styles.shadow,
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
            Typography.FONT_MEDIUM,
            props.reverse ? Styles.buttonTextReverse : Styles.buttonText,
            enabled ? {} : Styles.buttonTextDisabled,
            textStyle,
            enabled ? {} : disabledTextStyle,
          ]}
        >
          {buttonText}
        </Text>
        {nextIcon}
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
      <Text style={[Typography.FONT_REGULAR, Styles.linkText, textStyle]}>
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
