import React from 'react';
import { IssuesDetailSecondaryScreen } from '@views';
import { DeliveryReportTypes } from 'types';
import { render, fireEvent, toJSON } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

const setup = (issueOverrides: Record<string, unknown> = {}) => {
  const navigation = { navigate: jest.fn(), reset: jest.fn() };
  const route = {
    params: { issue: '', ...issueOverrides },
  };
  const store = mockStore({
    contact: {
      active: {
        state: 'MN',
        firstName: 'First',
        lastName: 'Last',
        inmateNumber: '6',
        relationship: 'Sister',
        facility: {
          address: 'P.O. Box 400',
          city: 'Bethel',
          name: 'Yukon Kskokwim Correctional Center',
          postal: '99559',
          state: 'AK',
          type: 'State Prison',
          phone: '1234567890',
        },
      },
    },
  });

  const StoreProvider = ({ children }: { children: JSX.Element }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return {
    navigation,
    route,
    ...render(
      <IssuesDetailSecondaryScreen navigation={navigation} route={route} />,
      {
        wrapper: StoreProvider,
      }
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

  it('should navigate to Home screen when issue haveNotReceived button #2 is pressed', async () => {
    const { navigation, getByText } = setup({
      issue: DeliveryReportTypes.haveNotReceived,
    });
    fireEvent.press(getByText("I'll wait"));
    expect(navigation.reset).toHaveBeenCalled();
  });
});
