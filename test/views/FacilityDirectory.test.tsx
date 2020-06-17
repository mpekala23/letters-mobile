import * as React from 'react';
import { FacilityDirectoryScreen } from '@views';
import { render, toJSON, fireEvent } from '@testing-library/react-native';
import { SET_ADDING } from '@store/Contact/ContactTypes';
import { Colors } from '@styles';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

const setup = (facilityOverrides = {}, routeOverrides = {}) => {
  const navigation = {
    navigate: jest.fn(),
    addListener: jest.fn(),
    setParams: jest.fn(),
  };
  const route = {
    params: {
      newFacility: null,
      ...routeOverrides,
    },
  };
  const contact = {
    state: '',
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

  const StoreProvider = ({ children }) => {
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

describe('Facility Directory Screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should have next button be disabled until facility selected', () => {
    const { navigation, getByText } = setup();
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);
    expect(
      getByText('Next').parentNode.props.style[1].backgroundColor
    ).toBeDefined();
    expect(navigation.navigate).toHaveBeenCalledTimes(0);
    fireEvent.press(getByText('State Prison'));
    fireEvent.press(nextButton);
    expect(getByText('Next').parentNode.props.style[1]).toEqual({});
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });

  it('should have the selected facility have a blue background', () => {
    const { navigation, getByText } = setup();
    const facility = getByText('State Prison').parentNode;
    expect(facility.props.style[1].backgroundColor).toBe('white');
    expect(facility.props.style[2]).toEqual({});
    fireEvent.press(facility);
    expect(facility.props.style[2].backgroundColor).toBe(Colors.SELECT);
    fireEvent.press(facility);
    expect(facility.props.style[1].backgroundColor).toBe('white');
    expect(facility.props.style[2]).toEqual({});
  });

  it('should dispatch facility info to the redux store when the next button is pressed', () => {
    const { store, getByText } = setup();
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);
    expect(store.getActions().length).toBe(0);
    fireEvent.press(getByText('State Prison'));
    fireEvent.press(nextButton);
    expect(store.getActions().length).toBe(1);
    expect(store.getActions()[0]).toEqual({
      type: SET_ADDING,
      payload: {
        facility: {
          address: 'P.O. Box 400',
          city: 'Bethel',
          name: 'Yukon Kskokwim Correctional Center',
          postal: '99559',
          state: 'AK',
          type: 'State Prison',
        },
        firstName: '',
        inmateNumber: '',
        lastName: '',
        relationship: '',
        state: '',
      },
    });
  });

  it('should navigate to the contact info screen when the back button is pressed', () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('Back'));
    expect(navigation.navigate).toHaveBeenCalledWith('ContactInfo');
  });

  it('should navigate to the add manually screen when the add manually button is pressed', () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('Add Manually'));
    expect(navigation.navigate).toHaveBeenCalledWith('AddManually');
  });

  it('should navigate to the review contact screen when the next button is pressed', () => {
    const { navigation, getByText } = setup();
    const nextButton = getByText('Next');
    fireEvent.press(getByText('State Prison'));
    fireEvent.press(nextButton);
    expect(navigation.navigate).toHaveBeenCalledWith('ReviewContact');
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
    const facility = getByText('State Prison').parentNode;
    // need to wait so that the call to setState can be processed in the facility directory component
    setTimeout(() => {
      expect(facility.props.style[2].backgroundColor).toBe(Colors.SELECT);
    }, 1);
  });

  it('should load initial facility from manual add', async () => {
    const { navigation, getByText } = setup(
      {
        state: 'MN',
        firstName: 'First',
        lastName: 'Last',
        inmateNumber: '6',
        relationship: 'Sister',
        facility: null,
      },
      {
        newFacility: {
          address: 'P.O. Box 400',
          city: 'Bethel',
          name: 'New Yukon Kskokwim Correctional Center',
          postal: '99559',
          state: 'AK',
          type: 'State Prison',
        },
      }
    );
    const facility = getByText('New Yukon Kskokwim Correctional Center')
      .parentNode;
    // need to wait so that the call to setState can be processed in the facility directory component
    setTimeout(() => {
      expect(facility.props.style[2].backgroundColor).toBe(Colors.SELECT);
    }, 1);
    expect(navigation.setParams).toHaveBeenCalledWith({ newFacility: null });
  });
});
