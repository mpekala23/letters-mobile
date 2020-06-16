import React, { createRef, RefObject } from "react";
import {
  Animated,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Keyboard,
} from "react-native";
import PropTypes, { any } from "prop-types";
import { validateFormat, Validation } from "@utils";
import Styles, {
  INPUT_HEIGHT,
  DROP_HEIGHT,
  OPTION_HEIGHT,
  VERTICAL_MARGIN,
} from "./Input.styles";
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
  onChangeText: (val: string) => void;
  secure?: boolean;
  required?: boolean;
  validate?: Validation;
  enabled?: boolean;
  options: string[] | string[][];
  nextInput?: RefObject<Input> | boolean;
}

export interface State {
  value: string;
  focused: boolean;
  valid: boolean;
  dirty: boolean;
  currentHeight: Animated.Value;
  results: string[];
  shown: boolean;
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
    onChangeText: () => {},
    secure: false,
    enabled: true,
    options: [],
    nextInput: false,
  };

  private inputRef = createRef<TextInput>();

  constructor(props: Props) {
    super(props);
    this.state = {
      value: "",
      focused: false,
      valid: props.validate || props.required ? false : true,
      dirty: false,
      currentHeight:
        this.props.options.length > 0
          ? new Animated.Value(INPUT_HEIGHT + VERTICAL_MARGIN * 2)
          : new Animated.Value(INPUT_HEIGHT),
      results: [],
      shown: false,
    };
    if (this.state.valid) {
      props.onValid();
    } else {
      props.onInvalid();
    }
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onSubmitEditing = this.onSubmitEditing.bind(this);
    this.set = this.set.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.updateHeight = this.updateHeight.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
  }

  componentDidMount() {
    this.set("");
  }

  onFocus() {
    this.setState({ focused: true, dirty: true }, () => {
      if (this.props.options.length > 0) {
        this.updateHeight();
      }
      this.props.onFocus();
    });
  }

  onBlur() {
    this.setState({ focused: false }, () => {
      if (this.props.validate || this.props.required) {
        this.doValidate();
      }
      if (this.props.options.length > 0) {
        this.updateHeight();
      }
      this.props.onBlur();
    });
  }

  onSubmitEditing() {
    if (typeof this.props.nextInput != "boolean" && this.props.nextInput) {
      this.props.nextInput.current?.forceFocus();
    }
    this.setState({ focused: false });
  }

  forceFocus() {
    this.inputRef.current?.focus();
  }

  set(newValue: string) {
    this.setState({ value: newValue }, () => {
      this.doValidate();
      if (this.props.options.length > 0) this.updateResults();
      this.props.onChangeText(newValue);
    });
  }

  updateResults() {
    const value = this.state.value;
    const options = this.props.options;
    let results: string[] = [];
    for (let ix = 0; ix < options.length; ++ix) {
      const option: string | string[] = options[ix];
      if (typeof option === "string") {
        // simple options, just a list of strings
        if (
          option.toLowerCase().substring(0, value.length) ===
          value.toLowerCase()
        ) {
          results.push(option);
        }
      } else {
        // complex options, a list of list of strings, first string in each list will be shown and chose,
        // the rest are additional matches to autocomplete
        for (let jx = 0; jx < option.length; ++jx) {
          const match: string = option[jx];
          if (
            match.toLowerCase().substring(0, value.length) ===
            value.toLowerCase()
          ) {
            results.push(option[0]);
            break;
          }
        }
      }
    }
    let pastLength = this.state.results.length;
    this.setState({ results: results }, () => {
      if (pastLength !== results.length) this.updateHeight();
    });
  }

  updateHeight() {
    let target: number;
    if (this.state.focused) {
      target = Math.max(
        Math.min(
          DROP_HEIGHT,
          INPUT_HEIGHT + this.state.results.length * OPTION_HEIGHT
        ),
        INPUT_HEIGHT + VERTICAL_MARGIN * 2
      );
    } else {
      target = INPUT_HEIGHT + VERTICAL_MARGIN * 2;
    }
    Animated.timing(this.state.currentHeight, {
      toValue: target,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }

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

  renderOptions() {
    const results = this.state.results;
    return this.state.focused ? (
      <ScrollView
        style={Styles.optionScroll}
        keyboardShouldPersistTaps="always"
      >
        {results.map((result: string) => {
          return (
            <TouchableOpacity
              style={Styles.optionContainer}
              onPress={() => {
                this.set(result);
                if (!this.props.nextInput) this.inputRef.current?.blur();
                this.onSubmitEditing();
              }}
              key={result}
            >
              <Text style={Typography.FONT_REGULAR}>{result}</Text>
            </TouchableOpacity>
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
      enabled,
    } = this.props;
    return (
      <Animated.View
        style={[
          Styles.parentStyle,
          this.props.options.length > 0 ? { marginBottom: 0 } : {},
          parentStyle,
          { height: this.state.currentHeight },
        ]}
        testID="parent"
        pointerEvents={enabled ? "auto" : "none"}
      >
        <ScrollView
          keyboardShouldPersistTaps="always"
          scrollEnabled={false}
          style={[Styles.scrollStyle, scrollStyle]}
        >
          <TextInput
            ref={this.inputRef}
            secureTextEntry={secure}
            placeholder={placeholder}
            onChangeText={this.set}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onSubmitEditing={this.onSubmitEditing}
            style={[
              Styles.baseInputStyle,
              !enabled
                ? Styles.disabledInputStyle
                : this.state.focused
                ? Styles.inputStyleFocused
                : !this.state.dirty
                ? {}
                : this.state.valid
                ? Styles.validStyle
                : Styles.invalidStyle,
              inputStyle,
            ]}
            value={this.state.value}
          />
          <View style={Styles.secureButtonsContainer}></View>
          <Animated.View
            style={[
              Styles.optionBackground,
              {
                height: Math.min(
                  DROP_HEIGHT - INPUT_HEIGHT,
                  this.state.results.length * OPTION_HEIGHT
                ),
              },
            ]}
          >
            {this.renderOptions()}
          </Animated.View>
        </ScrollView>
      </Animated.View>
    );
  }
}

export default Input;
