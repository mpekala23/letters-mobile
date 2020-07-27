import React from 'react';
import { IssuesDetailSecondaryScreen } from '@views';
import { DeliveryReportTypes } from 'types';
import { render, fireEvent, toJSON } from '@testing-library/react-native';

const setup = (issueOverrides: Record<string, unknown> = {}) => {
  const navigation = { navigate: jest.fn(), reset: jest.fn() };
  const route = {
    params: { issue: '', ...issueOverrides },
  };
  return {
    navigation,
    route,
    ...render(
      <IssuesDetailSecondaryScreen navigation={navigation} route={route} />
    ),
  };
};

describe('Issues Detail Secondary screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should navigate to Home screen when issue haveNotAsked button is pressed', async () => {
    const { navigation, getByText } = setup({
      issue: DeliveryReportTypes.haveNotAsked,
    });
    fireEvent.press(getByText('Return home'));
    expect(navigation.reset).toHaveBeenCalled();
  });

  // TO-DO: Test 'Call facility' button action

  it('should navigate to Home screen when issue haveNotReceived button #2 is pressed', async () => {
    const { navigation, getByText } = setup({
      issue: DeliveryReportTypes.haveNotReceived,
    });
    fireEvent.press(getByText("I'll wait"));
    expect(navigation.reset).toHaveBeenCalled();
  });
});
