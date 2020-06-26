import React from 'react';
import { SupportFAQDetailScreen } from '@views';
import { render, toJSON } from '@testing-library/react-native';

const setup = () => {
  const navigation = { navigate: jest.fn() };
  return {
    navigation,
    ...render(<SupportFAQDetailScreen navigation={navigation} />),
  };
};

describe('Support FAQ Detail screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  // TO-DO: Test navigation when button is pressed
});
