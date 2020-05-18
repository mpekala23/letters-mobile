import * as React from 'react';
import { Button } from 'components';
import PropTypes from 'prop-types';

function LoginScreen(props) {
  return (
    <Button
      buttonText="login"
      onPress={() => {
        const { navigation } = props;
        navigation.navigate('App');
      }}
    />
  );
}

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default LoginScreen;
