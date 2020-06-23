import React from 'react';
import { ExplainProblemScreen } from '@views';
import { render, fireEvent, toJSON } from '@testing-library/react-native';

const setup = () => {
  const navigation = { navigate: jest.fn() };
  return {
    navigation,
    ...render(<ExplainProblemScreen navigation={navigation} />),
  };
};

describe('Explain Problem screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });
  it('should navigate to thanks screen when report the problem is pressed', async () => {
    const { navigation, getByText } = setup();
    const reportButton = getByText('Report the problem');
    fireEvent.press(reportButton);
    expect(navigation.navigate).toHaveBeenCalledWith('Thanks');
  });
});
