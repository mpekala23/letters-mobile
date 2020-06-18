import React from 'react';
import Dropdown, {
  dropdownInfo,
  dropdownSuccess,
  dropdownWarning,
  dropdownError,
} from '@components/Dropdown/Dropdown.react';
import { Colors } from '@styles';
import { render, toJSON } from '@testing-library/react-native';

jest.useFakeTimers();

const setup = () => {
  return {
    ...render([Dropdown()]),
  };
};

describe('Dropdown component', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should implement info dropdowns', () => {
    const { getByText, getByTestId } = setup();
    dropdownInfo('title', 'body');
    const bodyText = getByText('body');
    expect(bodyText).toBeDefined();
    const touchable = getByTestId('touchable');
    expect(touchable.props.style[1].backgroundColor).toBe(Colors.AMEELIO_BLUE);
  });

  it('should implement success dropdowns', () => {
    const { getByText, getByTestId } = setup();
    dropdownSuccess('title', 'body');
    const bodyText = getByText('body');
    expect(bodyText).toBeDefined();
    const touchable = getByTestId('touchable');
    expect(touchable.props.style[1].backgroundColor).toBe(Colors.SUCCESS);
  });

  it('should implement warning dropdowns', () => {
    const { getByText, getByTestId } = setup();
    dropdownWarning('title', 'body');
    const bodyText = getByText('body');
    expect(bodyText).toBeDefined();
    const touchable = getByTestId('touchable');
    expect(touchable.props.style[1].backgroundColor).toBe(Colors.WARNING);
  });

  it('should implement error dropdowns', () => {
    const { getByText, getByTestId } = setup();
    dropdownError('title', 'body');
    const bodyText = getByText('body');
    expect(bodyText).toBeDefined();
    const touchable = getByTestId('touchable');
    expect(touchable.props.style[1].backgroundColor).toBe(Colors.ERROR);
  });

  it('should queue dropdowns', () => {
    const { getByText, queryByText } = setup();
    dropdownError('title1', 'body1');
    dropdownError('title2', 'body2');
    expect(getByText('body1')).toBeDefined();
    expect(queryByText('body2')).toBe(null);
  });
});
