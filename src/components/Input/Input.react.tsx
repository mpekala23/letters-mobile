import React, { useState, useEffect } from "react";
import { ScrollView, TextInput, View } from "react-native";
import PropTypes from "prop-types";
import { validateFormat, Validation } from "@utils";

import Styles from "./Input.styles";

export interface Props {
  parentStyle?: object;
  scrollStyle?: object;
  inputStyle?: object;
  placeholder?: string;
  onFocus: () => void;
  onBlur: () => void;
  onValid: () => void;
  onInvalid: () => void;
  secure?: boolean;
  required?: boolean;
  validate?: Validation;
}

export interface State {
  value: string;
  focused: boolean;
  valid: boolean;
  dirty: boolean;
}

class Input extends React.Component<Props, State> {
  static defaultProps = {
    parentStyle: {},
    scrollStyle: {},
    inputStyle: {},
    placeholder: "",
    onFocus: () => {},
    onBlur: () => {},
    onValid: () => {},
    onInvalid: () => {},
    secure: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      value: "",
      focused: false,
      valid: props.validate || props.required ? false : true,
      dirty: false,
    };
    // initial call to signal validity
    if (this.state.valid) {
      props.onValid();
    } else {
      props.onInvalid();
    }
  }

  set = (newValue: string) => {
    this.setState({ value: newValue }, this.doValidate);
  };

  doValidate = () => {
    const { value } = this.state;
    const { required, validate, onValid, onInvalid } = this.props;

    let result = true;
    if (validate) {
      result = validateFormat(validate, value);
    }
    if (required && value.length === 0) {
      result = false;
    }
    if (result === this.state.valid) {
      return;
    }
    this.setState(
      {
        valid: result,
      },
      () => {
        if (result) {
          onValid();
        } else {
          onInvalid();
        }
      }
    );
  };

  render() {
    const {
      onFocus,
      onBlur,
      parentStyle,
      scrollStyle,
      inputStyle,
      placeholder,
      secure,
      validate,
      required,
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
            onChangeText={this.set}
            onFocus={() => {
              this.setState({ focused: true, dirty: true });
              onFocus();
            }}
            onBlur={() => {
              this.setState({ focused: false });
              if (validate || required) {
                this.doValidate();
              }
              onBlur();
            }}
            style={[
              this.state.focused
                ? Styles.inputStyleFocused
                : !this.state.dirty || this.state.valid
                ? Styles.inputStyle
                : Styles.invalidStyle,
              inputStyle,
            ]}
            value={this.state.value}
          />
        </ScrollView>
      </View>
    );
  }
}

export default Input;
