import React, { useState, useEffect } from "react";
import {
  Animated,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Keyboard,
} from "react-native";
import PropTypes from "prop-types";
import { validateFormat, Validation } from "@utils";
import Styles, { INPUT_HEIGHT, DROP_HEIGHT } from "./Input.styles";
import { Typography } from "styles";

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
  options: string[];
}

export interface State {
  value: string;
  focused: boolean;
  valid: boolean;
  dirty: boolean;
  dropHeight: Animated.Value;
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
    options: [],
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      value: "",
      focused: false,
      valid: props.validate || props.required ? false : true,
      dirty: false,
      dropHeight: new Animated.Value(INPUT_HEIGHT),
    };
    if (this.state.valid) {
      props.onValid();
    } else {
      props.onInvalid();
    }
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
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

  onFocus() {
    this.setState({ focused: true, dirty: true });
    if (this.props.options.length > 0) {
      Animated.timing(this.state.dropHeight, {
        toValue: DROP_HEIGHT,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    this.props.onFocus();
  }

  onBlur() {
    this.setState({ focused: false });
    if (this.props.validate || this.props.required) {
      this.doValidate();
    }
    if (this.props.options.length > 0) {
      Animated.timing(this.state.dropHeight, {
        toValue: INPUT_HEIGHT,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    this.props.onBlur();
  }

  renderOptions() {
    return this.state.focused ? (
      <ScrollView
        style={Styles.optionScroll}
        keyboardShouldPersistTaps="always"
      >
        {this.props.options?.map((option) => {
          return this.state.value.toLowerCase() ===
            option.toLowerCase().substring(0, this.state.value.length) ? (
            <TouchableOpacity
              style={Styles.optionContainer}
              onPress={() => {
                this.set(option);
                Keyboard.dismiss();
              }}
            >
              <Text style={Typography.FONT_REGULAR}>{option}</Text>
            </TouchableOpacity>
          ) : (
            <View />
          );
        })}
      </ScrollView>
    ) : (
      <View />
    );
  }

  render() {
    const {
      parentStyle,
      scrollStyle,
      inputStyle,
      placeholder,
      secure,
      validate,
      required,
    } = this.props;
    return (
      <View>
        <Animated.View
          style={[
            Styles.parentStyle,
            parentStyle,
            { height: this.state.dropHeight },
          ]}
        >
          <ScrollView
            keyboardShouldPersistTaps="always"
            scrollEnabled={false}
            style={[Styles.scrollStyle, scrollStyle]}
          >
            <TextInput
              secureTextEntry={secure}
              placeholder={placeholder}
              onChangeText={this.set}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
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
            <View style={Styles.optionBackground}>{this.renderOptions()}</View>
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}

export default Input;
