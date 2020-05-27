import React, { useState, useEffect } from "react";
import { ScrollView, TextInput, View } from "react-native";
import PropTypes from "prop-types";

import Styles from "./Input.styles";

export interface Props {
  parentStyle?: object;
  scrollStyle?: object;
  inputStyle?: object;
  placeholder?: string;
}

const Input: React.FC<Props> = (props) => {
  const [focused, setFocused] = useState(false);

  const { parentStyle, scrollStyle, inputStyle, placeholder } = props;
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
          }}
          onBlur={() => {
            setFocused(false);
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
};

Input.defaultProps = {
  parentStyle: {},
  scrollStyle: {},
  inputStyle: {},
  placeholder: "",
};

export default Input;
