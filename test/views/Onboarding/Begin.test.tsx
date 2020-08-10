import * as React from 'react';
import { BeginScreen } from '@views';
import { render, toJSON, fireEvent } from '@testing-library/react-native';

const setup = () => {
  const navigation = { navigate: jest.fn() };
  return {
    navigation,
    ...render(<BeginScreen navigation={navigation} />),
  };
};

describe('Begin screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should show the logo', () => {
    const { getByLabelText } = render(<BeginScreen />);
    expect(getByLabelText('Ameelio Logo')).toBeDefined();
  });

  it('should navigate to register screen when sign up is pressed', () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('Sign up'));
    expect(navigation.navigate).toHaveBeenCalledWith('Register');
  });

  it('should navigate to login screen when log in is pressed', () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('Log in'));
    expect(navigation.navigate).toHaveBeenCalledWith('Login');
  });
});
