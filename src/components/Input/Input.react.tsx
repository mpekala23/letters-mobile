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
}

const Input: React.FC<Props> = (props) => {
  const [focused, setFocused] = useState(false);

  const {
    onFocus,
    onBlur,
    parentStyle,
    scrollStyle,
    inputStyle,
    placeholder,
  } = props;
  return (
    <View style={[Styles.parentStyle, parentStyle]}>
      <ScrollView
        keyboardShouldPersistTaps="never"
        scrollEnabled={false}
        style={[Styles.scrollStyle, scrollStyle]}
      >
        <TextInput
          placeholder={placeholder}
          onFocus={() => {
            setFocused(true);
            onFocus();
          }}
          onBlur={() => {
            setFocused(false);
            onBlur();
          }}
          style={[
            focused ? Styles.inputStyleFocused : Styles.inputStyle,
            inputStyle,
          ]}
        />
      </ScrollView>
    </View>
  );
};

Input.propTypes = {
  parentStyle: PropTypes.objectOf(PropTypes.string),
  scrollStyle: PropTypes.objectOf(PropTypes.string),
  inputStyle: PropTypes.objectOf(PropTypes.string),
  placeholder: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

Input.defaultProps = {
  parentStyle: {},
  scrollStyle: {},
  inputStyle: {},
  placeholder: "",
  onFocus: () => {},
  onBlur: () => {},
};

export default Input;
