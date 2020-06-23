import React from 'react';
import { ProfilePic } from '@components';
import { render, toJSON } from '@testing-library/react-native';

const setup = (propOverrides = {}) => {
  const props = {
    firstName: 'Team',
    lastName: 'Ameelio',
    ...propOverrides,
  };

  return {
    ...render(<ProfilePic {...props} />),
    props,
  };
};

describe('ProfilePic component', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should display initials when a user has no profile picture', () => {
    const imageUri = '';
    const { getAllByText } = setup({ imageUri });
    expect(getAllByText('TA').length).toBe(1);
  });

  it('should show image when user has profile picture', () => {
    const imageUri = 'placeholder';
    const { getByLabelText } = setup({ imageUri });
    expect(getByLabelText('Profile Picture')).toBeDefined();
  });
});
