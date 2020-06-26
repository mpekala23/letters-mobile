import React from 'react';
import { SupportFAQScreen } from '@views';
import { render, fireEvent, toJSON } from '@testing-library/react-native';

const setup = () => {
  const navigation = { navigate: jest.fn() };
  return {
    navigation,
    ...render(<SupportFAQScreen navigation={navigation} />),
  };
};

describe('Support FAQ screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should navigate to Support FAQ detail screen when button is pressed', async () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('I want to cancel my letter'));
    expect(navigation.navigate).toHaveBeenCalledWith('SupportFAQDetail');
  });

  it('should navigate to Support FAQ detail screen when button #1 is pressed', async () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('I want to cancel my letter'));
    expect(navigation.navigate).toHaveBeenCalledWith('SupportFAQDetail');
  });

  it('should navigate to Support FAQ detail screen when button #2 is pressed', async () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('My letter is taking a long time to arrive'));
    expect(navigation.navigate).toHaveBeenCalledWith('SupportFAQDetail');
  });

  it('should navigate to Support FAQ detail screen when button #3 is pressed', async () => {
    const { navigation, getByText } = setup();
    fireEvent.press(
      getByText("I sent my letter more than 6 days ago and it's not here yet")
    );
    expect(navigation.navigate).toHaveBeenCalledWith('SupportFAQDetail');
  });

  it('should navigate to Support FAQ detail screen when button #4 is pressed', async () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('I put the wrong mailing address'));
    expect(navigation.navigate).toHaveBeenCalledWith('SupportFAQDetail');
  });

  it('should navigate to Support FAQ detail screen when button #5 is pressed', async () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText("There's something wrong with tracking"));
    expect(navigation.navigate).toHaveBeenCalledWith('SupportFAQDetail');
  });

  it('should navigate to Support FAQ detail screen when button #6 is pressed', async () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText("It's something else"));
    expect(navigation.navigate).toHaveBeenCalledWith('SupportFAQDetail');
  });
});
