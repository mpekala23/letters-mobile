import React from 'react';
import { IssuesScreen } from '@views';
import { DeliveryReportTypes } from 'types';
import { render, fireEvent, toJSON } from '@testing-library/react-native';

const setup = () => {
  const navigation = { navigate: jest.fn() };
  return {
    navigation,
    ...render(<IssuesScreen navigation={navigation} />),
  };
};

describe('Issues screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should navigate to IssuesDetail screen when button #1 is pressed', async () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('Yep, they received it!'));
    expect(navigation.navigate).toHaveBeenCalledWith('IssuesDetail', {
      issue: DeliveryReportTypes.received,
    });
  });

  it('should navigate to IssuesDetail screen when button #2 is pressed', async () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText("I'm not sure yet..."));
    expect(navigation.navigate).toHaveBeenCalledWith('IssuesDetail', {
      issue: DeliveryReportTypes.unsure,
    });
  });

  it('should navigate to IssuesDetail screen when button #3 is pressed', async () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText("They haven't received it"));
    expect(navigation.navigate).toHaveBeenCalledWith('IssuesDetail', {
      issue: DeliveryReportTypes.notYetReceived,
    });
  });
});
