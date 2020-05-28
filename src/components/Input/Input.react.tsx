import React, { useState, useEffect } from "react";
import { ScrollView, TextInput, View } from "react-native";
import PropTypes from "prop-types";

import Styles from "./Input.styles";

export interface Props {
  parentStyle?: object;
  scrollStyle?: object;
  inputStyle?: object;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  secure: boolean;
}

export interface State {
  value: string;
  focused: boolean;
}

class Input extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      focused: false,
    };
  }

  render() {
    const {
      onFocus,
      onBlur,
      parentStyle,
      scrollStyle,
      inputStyle,
      placeholder,
      secure,
    } = this.props;
    return (
      <View style={[Styles.parentStyle, parentStyle]}>
        <ScrollView
          keyboardShouldPersistTaps="never"
          scrollEnabled={false}
          style={[Styles.scrollStyle, scrollStyle]}
        >
          <TextInput
            secureTextEntry={secure}
            placeholder={placeholder}
            onChangeText={(val) => {
              this.setState({ value: val });
            }}
            onFocus={() => {
              this.setState({ focused: true });
              onFocus();
            }}
            onBlur={() => {
              this.setState({ focused: false });
              onBlur();
            }}
            style={[
              this.state.focused ? Styles.inputStyleFocused : Styles.inputStyle,
              inputStyle,
            ]}
          />
        </ScrollView>
      </View>
    );
  }
}

Input.propTypes = {
  parentStyle: PropTypes.objectOf(PropTypes.string),
  scrollStyle: PropTypes.objectOf(PropTypes.string),
  inputStyle: PropTypes.objectOf(PropTypes.string),
  placeholder: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  secure: PropTypes.bool,
};

Input.defaultProps = {
  parentStyle: {},
  scrollStyle: {},
  inputStyle: {},
  placeholder: "",
  onFocus: () => {},
  onBlur: () => {},
  secure: false,
};

export default Input;
