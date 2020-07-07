import Alert, { popupAlert } from '@components/Alert/Alert.react';
import { render, toJSON, fireEvent } from '@testing-library/react-native';

const setup = () => {
  return {
    ...render(Alert()),
  };
};

describe('Alert component', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should implement alert titles', () => {
    const { getByText } = setup();
    popupAlert({
      title: 'Title',
      message: '',
      buttons: [],
    });
    expect(getByText('Title')).toBeDefined();
  });

  it('should implement alert messages', () => {
    const { getByText } = setup();
    popupAlert({
      title: '',
      message: 'Message',
      buttons: [],
    });
    expect(getByText('Message')).toBeDefined();
  });

  it('should implement alert buttons', () => {
    const { getByText } = setup();
    const dummy = jest.fn();
    popupAlert({
      title: '',
      message: '',
      buttons: [
        {
          text: 'Button',
          reverse: true,
          onPress: dummy,
        },
      ],
    });
    const button = getByText('Button');
    expect(button).toBeDefined();
    fireEvent.press(button);
    expect(dummy).toHaveBeenCalledTimes(1);
  });
});
