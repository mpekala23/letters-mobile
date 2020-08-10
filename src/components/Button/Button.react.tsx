import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  TextStyle,
  View,
  ViewStyle,
  Image,
} from 'react-native';
import { Typography } from '@styles';
import Next from '@assets/components/Button/Next';
import { SvgXml } from 'react-native-svg';
import Loading from '@assets/common/loading.gif';
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
  blocking?: boolean;
  onPress: () => void | Promise<void>;
  children?: JSX.Element | JSX.Element[];
  showNextIcon?: boolean;
}

const Button: React.FC<Props> = (props: Props) => {
  const [blocked, setBlocked] = useState(false);

  const {
    containerStyle,
    disabledContainerStyle,
    disabledTextStyle,
    blocking,
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
          enabled && !blocked ? {} : Styles.buttonBackgroundDisabled,
          containerStyle,
          enabled && !blocked ? {} : disabledContainerStyle,
          Styles.shadow,
        ]}
        activeOpacity={enabled && !blocked ? 0.7 : 1.0}
        onPress={async () => {
          if (enabled && !blocked) {
            if (blocking) {
              setBlocked(true);
              await onPress();
              setBlocked(false);
            } else {
              onPress();
            }
          }
        }}
        testID="clickable"
      >
        {buttonText ? (
          <Text
            style={[
              Typography.FONT_MEDIUM,
              props.reverse ? Styles.buttonTextReverse : Styles.buttonText,
              enabled ? {} : Styles.buttonTextDisabled,
              textStyle,
              enabled ? {} : disabledTextStyle,
              { opacity: blocked ? 0 : 1 },
            ]}
          >
            {buttonText}
          </Text>
        ) : (
          children
        )}
        {nextIcon}
        {blocked && (
          <Image
            testID="loading"
            source={Loading}
            style={{ width: 20, height: 20, position: 'absolute' }}
          />
        )}
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
      {buttonText ? (
        <Text style={[Typography.FONT_REGULAR, Styles.linkText, textStyle]}>
          {buttonText}
        </Text>
      ) : (
        children
      )}
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
