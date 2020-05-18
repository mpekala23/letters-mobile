import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import Styles from './Button.styles';

/**
 * A consistent button component to use across the app.
 * @param {object} props
 * @param {object} props.containerStyle - Styles the TouchableOpacity driving the button.
 * @param {object} props.textStyle - Styles the Text in the button.
 * @param {string} props.buttonText - Text to go inside the button.
 * @param {func} props.onPress - Function to call when the button is pressed.
 */
function Button(props) {
  const { containerStyle, onPress, textStyle, buttonText } = props;
  return (
    <TouchableOpacity style={[Styles.buttonBackground, containerStyle]} onPress={onPress}>
      <Text style={[Styles.buttonText, textStyle]}>{buttonText}</Text>
    </TouchableOpacity>
  );
}

Button.propTypes = {
  containerStyle: PropTypes.objectOf(PropTypes.string),
  textStyle: PropTypes.objectOf(PropTypes.string),
  buttonText: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

Button.defaultProps = {
  containerStyle: {},
  textStyle: {},
};

export default Button;
