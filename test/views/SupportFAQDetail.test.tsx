import React from 'react';
import { SupportFAQDetailScreen } from '@views';
import { render, toJSON, fireEvent } from '@testing-library/react-native';
import { SupportFAQTypes } from '../../src/types';

const setup = (issueOverrides: Record<string, unknown>) => {
  const navigation = { navigate: jest.fn() };
  const route = {
    params: { issue: '', ...issueOverrides },
  };
  return {
    navigation,
    route,
    ...render(<SupportFAQDetailScreen navigation={navigation} route={route} />),
  };
};

describe('Support FAQ Detail screen', () => {
  it('should match snapshot', () => {
    const { container } = setup(<SupportFAQDetailScreen />);
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('no call-to-action for DeleteLetter', () => {
    const { getByTestId } = setup({
      issue: SupportFAQTypes.DeleteLetter,
    });
    expect(getByTestId('callToActionButton').props.children).toBe(null);
  });

  it('no call-to-action for NotArrived', () => {
    const { getByTestId } = setup({
      issue: SupportFAQTypes.NotArrived,
    });
    expect(getByTestId('callToActionButton').props.children).toBe(null);
  });

  it('no call-to-action for TrackingNumber', () => {
    const { getByTestId } = setup({
      issue: SupportFAQTypes.TrackingNumber,
    });
    expect(getByTestId('callToActionButton').props.children).toBe(null);
  });

  it('should navigate to update contact screen when WrongMailingAddress button is pressed', () => {
    const { navigation, getByText } = setup({
      issue: SupportFAQTypes.WrongMailingAddress,
    });
    fireEvent.press(getByText('Update address'));
    expect(navigation.navigate).toHaveBeenCalledWith('UpdateContact');
  });

  // TO-DO: Should navigate to update profile screen when WrongReturnAddress button is pressed
});
