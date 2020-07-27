import React, { createRef, RefObject } from 'react';
import {
  Animated,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ViewStyle,
} from 'react-native';
import ClearPassword from '@assets/components/Input/ClearPassword';
import TogglePassword from '@assets/components/Input/TogglePassword';
import CreditCard from '@assets/components/Input/CreditCard';
import { validateFormat, Validation } from '@utils';
import { Typography } from '@styles';
import Styles, {
  INPUT_HEIGHT,
  DROP_HEIGHT,
  OPTION_HEIGHT,
} from './Input.styles';
import Icon from '../Icon/Icon.react';

export interface Props {
  parentStyle?: ViewStyle | ViewStyle[];
  inputStyle?: Record<string, unknown>;
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
  height: number;
  numLines: number;
  children?: JSX.Element;
  testId?: string;
  allowsEmoji: boolean;
  mustMatch?: string;
}

export interface State {
  value: string;
  focused: boolean;
  valid: boolean;
  dirty: boolean;
  currentHeight: Animated.Value;
  results: string[];
  shown: boolean;
  scroll: boolean;
}

class Input extends React.Component<Props, State> {
  private inputRef = createRef<TextInput>();

  private scrollRef = createRef<ScrollView>();

  static defaultProps = {
    parentStyle: {},
    inputStyle: {},
    placeholder: '',
    onFocus: (): null => null,
    onBlur: (): null => null,
    onValid: (): null => null,
    onInvalid: (): null => null,
    onChangeText: (): null => null,
    secure: false,
    enabled: true,
    options: [],
    nextInput: false,
    height: INPUT_HEIGHT,
    numLines: 1,
    allowsEmoji: false,
    required: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      value: '',
      focused: false,
      valid: !(props.validate || props.required),
      dirty: false,
      currentHeight: new Animated.Value(props.height),
      results: [],
      shown: false,
      scroll: true,
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

  componentDidMount(): void {
    this.set('');
  }

  onFocus(): void {
    this.setState({ focused: true, dirty: true }, () => {
      if (this.props.options.length > 0) {
        this.updateHeight();
      }
      this.props.onFocus();
    });
  }

  onBlur(): void {
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

  onSubmitEditing(): void {
    if (typeof this.props.nextInput !== 'boolean' && this.props.nextInput) {
      if (this.props.nextInput.current)
        this.props.nextInput.current.forceFocus();
    }
    this.setState({ focused: false });
  }

  doValidate = (): void => {
    const { value } = this.state;
    const { required, validate, onValid, onInvalid, mustMatch } = this.props;
    let result = true;
    if (value || validate || required) {
      if (validate) {
        result = validateFormat(validate, value);
      }
      if (required && !/\S/.test(value)) {
        result = false;
      }
    } else {
      result = false;
    }
    if (mustMatch) {
      result = result && mustMatch === value;
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

  updateHeight(): void {
    let target: number;
    if (this.state.focused) {
      target = Math.max(
        Math.min(
          DROP_HEIGHT,
          INPUT_HEIGHT + this.state.results.length * OPTION_HEIGHT
        ),
        INPUT_HEIGHT
      );
    } else {
      target = INPUT_HEIGHT;
    }
    Animated.timing(this.state.currentHeight, {
      toValue: target,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }

  updateResults(): void {
    const { value } = this.state;
    const { options } = this.props;
    const results: string[] = [];
    for (let ix = 0; ix < options.length; ix += 1) {
      const option: string | string[] = options[ix];
      if (typeof option === 'string') {
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
        for (let jx = 0; jx < option.length; jx += 1) {
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
    const pastLength = this.state.results.length;
    this.setState({ results }, () => {
      if (pastLength !== results.length) this.updateHeight();
    });
  }

  set(newValue: string): void {
    this.setState({ value: newValue }, () => {
      this.doValidate();
      if (this.props.options.length > 0) this.updateResults();
      this.props.onChangeText(newValue);
    });
  }

  forceFocus(): void {
    if (this.inputRef.current) this.inputRef.current.focus();
  }

  renderOptions(): JSX.Element {
    const { results } = this.state;
    return (
      <ScrollView
        style={Styles.optionScroll}
        keyboardShouldPersistTaps="always"
        scrollEnabled={this.state.scroll}
        nestedScrollEnabled
      >
        {results.map((result: string, index: number) => {
          return (
            <TouchableOpacity
              style={[
                Styles.optionContainer,
                index === results.length - 1 ? { borderBottomWidth: 0 } : {},
              ]}
              onPress={() => {
                this.set(result);
                if (!this.props.nextInput && this.inputRef.current)
                  this.inputRef.current.blur();
                this.onSubmitEditing();
              }}
              key={result}
            >
              <Text style={Typography.FONT_REGULAR}>{result}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }

  render(): JSX.Element {
    const {
      parentStyle,
      inputStyle,
      placeholder,
      secure,
      enabled,
      validate,
      numLines,
      required,
      options,
    } = this.props;

    let calcInputStyle;
    if (!enabled) {
      calcInputStyle = Styles.disabledInputStyle;
    } else if (this.state.focused || (!validate && !required)) {
      calcInputStyle = Styles.inputStyleFocused;
    } else if (!this.state.dirty) {
      calcInputStyle = {};
    } else if (this.state.valid) {
      calcInputStyle = Styles.validStyle;
    } else {
      calcInputStyle = Styles.invalidStyle;
    }

    return (
      <Animated.View
        style={[
          Styles.parentStyle,
          this.props.options.length > 0 ? { marginBottom: 0 } : {},
          parentStyle,
          options.length > 0
            ? { height: this.state.currentHeight }
            : { height: this.props.height },
        ]}
        testID="parent"
        pointerEvents={enabled ? 'auto' : 'none'}
      >
        {this.state.valid ? <View testID="valid" /> : <View testID="invalid" />}
        {this.state.focused ? (
          <View testID="focused" />
        ) : (
          <View testID="unfocused" />
        )}
        <TextInput
          ref={this.inputRef}
          secureTextEntry={secure && !this.state.shown}
          placeholder={placeholder}
          onChangeText={this.set}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onSubmitEditing={this.onSubmitEditing}
          multiline={numLines > 1}
          numberOfLines={numLines}
          style={[
            Styles.baseInputStyle,
            calcInputStyle,
            validate === Validation.CreditCard ? { paddingLeft: 65 } : {},
            { height: this.props.height },
            inputStyle,
            Typography.FONT_REGULAR,
          ]}
          value={this.state.value}
        />
        {validate === Validation.CreditCard && (
          <View
            style={[
              {
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                left: 20,
              },
              { opacity: enabled ? 1.0 : 0.7 },
            ]}
          >
            <Icon svg={CreditCard} />
          </View>
        )}
        {secure && this.state.focused && (
          <View style={Styles.secureButtonsContainer}>
            <TouchableOpacity
              onPress={() => {
                this.set('');
              }}
            >
              <Icon svg={ClearPassword} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState(({ shown }) => {
                  return {
                    shown: !shown,
                  };
                });
              }}
            >
              <Icon svg={TogglePassword} />
            </TouchableOpacity>
          </View>
        )}
        <Animated.View
          style={[
            Styles.optionBackground,
            {
              height: Math.min(
                DROP_HEIGHT - this.props.height,
                this.state.results.length * OPTION_HEIGHT
              ),
            },
          ]}
        >
          {this.renderOptions()}
        </Animated.View>
        {this.props.children}
      </Animated.View>
    );
  }
}

export default Input;
