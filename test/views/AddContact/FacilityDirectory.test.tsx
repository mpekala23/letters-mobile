import * as React from 'react';
import { FacilityDirectoryScreen } from '@views';
import { render, toJSON, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

jest.mock('@api', () => ({
  getFacilities: jest.fn().mockReturnValue([
    {
      name: 'Yukon Kskokwim Correctional Center',
      type: 'State Prison',
      address: 'P.O. Box 400',
      city: 'Bethel',
      state: 'Alaska',
      postal: '99559',
    },
  ]),
}));

const mockStore = configureStore([]);

const setup = (facilityOverrides = {}, routeOverrides = {}) => {
  const navigation = {
    navigate: jest.fn(),
    addListener: jest.fn(),
    setParams: jest.fn(),
  };
  const route = {
    params: {
      phyState: '',
      ...routeOverrides,
    },
  };
  const contact = {
    firstName: '',
    lastName: '',
    inmateNumber: '',
    relationship: '',
    facility: null,
    ...facilityOverrides,
  };
  const initialState = {
    adding: contact,
    existing: [],
  };
  const store = mockStore({
    contact: initialState,
  });

  const StoreProvider = ({ children }: { children: JSX.Element }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    navigation,
    store,
    ...render(
      <FacilityDirectoryScreen
        navigation={navigation}
        contactState={initialState}
        route={route}
      />,
      {
        wrapper: StoreProvider,
      }
    ),
  };
};

function sleep(ms: number) {
  jest.useRealTimers();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Facility Directory Screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should have the selected facility have a pink background', async () => {
    const { getByText } = setup();
    await sleep(1);
    const facility = getByText('Yukon Kskokwim Correctional Center').parentNode;
    expect(facility.props.style[1].backgroundColor).toBe('white');
    expect(facility.props.style[2]).toEqual({});
    fireEvent.press(facility);
    expect(facility.props.style[2].borderColor).toBe('#FF7171');
    fireEvent.press(facility);
    expect(facility.props.style[1].borderColor).toBe('white');
    expect(facility.props.style[2]).toEqual({});
  });

  it('should navigate to the add manually screen when the add manually button is pressed', () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('Add Manually'));
    expect(navigation.navigate).toHaveBeenCalledWith('AddManually', {
      phyState: '',
    });
  });

  it('should load initial facility value from the redux store', async () => {
    const { getByText } = setup({
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
      },
    });
    await sleep(1);
    const facility = getByText('Yukon Kskokwim Correctional Center').parentNode;
    expect(facility.props.style[1].backgroundColor).toBe('white');
  });

  it('should show hint message when contact state is Pennsylvania', async () => {
    const { getByTestId } = setup(
      {},
      {
        phyState: 'Pennsylvania',
      }
    );
    await sleep(1);
    expect(getByTestId('hintText')).toBeDefined();
  });
});
