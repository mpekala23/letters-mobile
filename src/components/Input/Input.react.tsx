import React, { createRef, RefObject } from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ViewStyle,
  Platform,
} from 'react-native';
import ClearPassword from '@assets/components/Input/ClearPassword';
import TogglePassword from '@assets/components/Input/TogglePassword';
import CreditCard from '@assets/components/Input/CreditCard';
import { validateFormat, Validation } from '@utils';
import { Typography } from '@styles';
import Styles from './Input.styles';
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
  onSubmitEditing: () => void;
  blurOnSubmit: boolean;
  secure?: boolean;
  required?: boolean;
  validate?: Validation;
  enabled?: boolean;
  nextInput?: RefObject<Input> | boolean;
  numLines: number;
  children?: JSX.Element | JSX.Element[];
  testId?: string;
  invalidFeedback?: string;
  mustMatch?: string;
  trimWhitespace: boolean;
  isInvalidInput: () => boolean; // additional validation if neighboring input is needed
}

export interface State {
  value: string;
  focused: boolean;
  valid: boolean;
  dirty: boolean;
  shown: boolean;
}

class Input extends React.Component<Props, State> {
  private inputRef = createRef<TextInput>();

  static defaultProps = {
    parentStyle: {},
    inputStyle: {},
    placeholder: '',
    onFocus: (): null => null,
    onBlur: (): null => null,
    onValid: (): null => null,
    onInvalid: (): null => null,
    onChangeText: (): null => null,
    onSubmitEditing: (): null => null,
    blurOnSubmit: true,
    secure: false,
    enabled: true,
    nextInput: false,
    numLines: 1,
    required: false,
    trimWhitespace: true,
    isInvalidInput: (): false => false,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      value: '',
      focused: false,
      valid: !(props.validate || props.required),
      dirty: false,
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
  }

  componentDidMount(): void {
    this.set('');
  }

  onFocus(): void {
    this.setState({ focused: true, dirty: true }, () => {
      this.props.onFocus();
    });
  }

  onBlur(): void {
    if (this.props.trimWhitespace) {
      this.set(this.state.value.trim());
    }
    this.setState({ focused: false }, () => {
      if (this.props.validate || this.props.required) {
        this.doValidate();
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
    this.props.onSubmitEditing();
  }

  doValidate = (): void => {
    const { value } = this.state;
    const {
      required,
      validate,
      onValid,
      onInvalid,
      mustMatch,
      isInvalidInput,
    } = this.props;
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
    if (isInvalidInput()) {
      result = false;
    }
    if (!required && value === '') {
      result = true;
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

  set(newValue: string): void {
    this.setState({ value: newValue }, () => {
      this.doValidate();
      this.props.onChangeText(newValue);
    });
  }

  forceFocus(): void {
    if (this.inputRef.current) this.inputRef.current.focus();
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
      invalidFeedback,
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
      <>
        <View
          style={[Styles.parentStyle, parentStyle]}
          testID="parent"
          pointerEvents={enabled ? 'auto' : 'none'}
        >
          {this.state.valid ? (
            <View testID="valid" />
          ) : (
            <View testID="invalid" />
          )}
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
            blurOnSubmit={numLines < 2 && this.props.blurOnSubmit}
            multiline={numLines > 1}
            numberOfLines={numLines}
            style={[
              Styles.baseInputStyle,
              calcInputStyle,
              validate === Validation.CreditCard ? { paddingLeft: 65 } : {},
              inputStyle,
              Typography.FONT_REGULAR,
              Platform.OS === 'android' ? { paddingTop: 2 } : {},
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
          {this.props.children}
        </View>
        {invalidFeedback &&
          !this.state.valid &&
          this.state.dirty &&
          !this.state.focused && (
            <View
              style={[
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                },
                { opacity: enabled ? 1.0 : 0.7 },
              ]}
            >
              <Text>{invalidFeedback}</Text>
            </View>
          )}
      </>
    );
  }
}

export default Input;
