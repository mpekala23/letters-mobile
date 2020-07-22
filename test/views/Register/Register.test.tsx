import React from 'react';
import { RegisterScreen } from '@views';
import { register } from '@api';
import { render, fireEvent, toJSON, act } from '@testing-library/react-native';
import fetchMock from 'jest-fetch-mock';
import { sleep } from '@utils';

process.env.MOCK_API_IP = 'test_mock_api';

jest.mock('@api', () => ({
  register: jest.fn(),
}));

const setup = (response = {}) => {
  const navigation = { navigate: jest.fn() };
  if (Object.keys(response).length > 0) {
    fetchMock.mockOnce(JSON.stringify(response));
  }
  return render(<RegisterScreen navigation={navigation} />);
};

describe('Register screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should have register button be disabled until all fields are valid', async () => {
    jest.useRealTimers();
    const { getByPlaceholderText, getByText } = setup();
    fireEvent.press(getByText('Register'));
    expect(register).toHaveBeenCalledTimes(0);
    fireEvent.changeText(getByPlaceholderText('First Name'), 'Team');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Ameelio');
    fireEvent.changeText(
      getByPlaceholderText('Cell Phone Number'),
      '4324324432'
    );
    fireEvent.changeText(getByPlaceholderText('Address Line 1'), 'Somewhere');
    fireEvent.changeText(getByPlaceholderText('Zip Code'), '12345');
    fireEvent.changeText(getByPlaceholderText('City'), 'New Haven');
    fireEvent.changeText(getByPlaceholderText('State'), 'Iowa');
    fireEvent.changeText(
      getByPlaceholderText('E-mail Address'),
      'team@ameelio.org'
    );
    fireEvent.changeText(getByPlaceholderText('Password'), 'ThisGood1');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'ThisGood1');
    fireEvent.changeText(
      getByPlaceholderText('How did you hear about Ameelio?'),
      'Other'
    );
    await act(async () => {
      fireEvent.press(getByText('Register'));
      await sleep(10);
    });
    expect(register).toHaveBeenCalledTimes(1);
  });
});
