import React from 'react';
import { KeyboardAvoidingView, ViewStyle, Platform } from 'react-native';

interface Props {
  style?: ViewStyle;
  children?: JSX.Element | JSX.Element[];
}

const KeyboardAvoider: React.FC<Props> = (props: Props) => {
  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, props.style]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : -200}
      enabled
    >
      {props.children}
    </KeyboardAvoidingView>
  );
};

KeyboardAvoider.defaultProps = {
  style: {},
  children: [],
};

export default KeyboardAvoider;
