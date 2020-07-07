import React from 'react';
import { SupportFAQScreen } from '@views';
import { render, fireEvent, toJSON } from '@testing-library/react-native';
import { SupportFAQTypes } from '../../src/types';

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

  it('should navigate to Support FAQ detail screen when button #1 is pressed', async () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('I want to delete my letter'));
    expect(navigation.navigate).toHaveBeenCalledWith('SupportFAQDetail', {
      issue: SupportFAQTypes.DeleteLetter,
    });
  });

  it('should navigate to Support FAQ detail screen when button #2 is pressed', async () => {
    const { navigation, getByText } = setup();
    fireEvent.press(
      getByText(
        "I sent my letter more than 6 days ago and it hasn't arrived at the facility yet"
      )
    );
    expect(navigation.navigate).toHaveBeenCalledWith('SupportFAQDetail', {
      issue: SupportFAQTypes.NotArrived,
    });
  });

  it('should navigate to Support FAQ detail screen when button #3 is pressed', async () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('I put the wrong mailing address'));
    expect(navigation.navigate).toHaveBeenCalledWith('SupportFAQDetail', {
      issue: SupportFAQTypes.WrongMailingAddress,
    });
  });

  it('should navigate to Support FAQ detail screen when button #4 is pressed', async () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('I put the wrong return address'));
    expect(navigation.navigate).toHaveBeenCalledWith('SupportFAQDetail', {
      issue: SupportFAQTypes.WrongReturnAddress,
    });
  });

  it('should navigate to Support FAQ detail screen when button #5 is pressed', async () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('I would like the USPS tracking number'));
    expect(navigation.navigate).toHaveBeenCalledWith('SupportFAQDetail', {
      issue: SupportFAQTypes.TrackingNumber,
    });
  });

  it('should navigate to Support FAQ detail screen when button #6 is pressed', async () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText("There's something wrong with tracking"));
    expect(navigation.navigate).toHaveBeenCalledWith('SupportFAQDetail', {
      issue: SupportFAQTypes.TrackingError,
    });
  });

  it('should navigate to Support FAQ detail screen when button #7 is pressed', async () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('I want to talk to someone at Ameelio'));
    expect(navigation.navigate).toHaveBeenCalledWith('SupportFAQDetail', {
      issue: SupportFAQTypes.TalkToAmeelio,
    });
  });
});
