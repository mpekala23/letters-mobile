import React from 'react';
import PicUpload, {
  PicUploadTypes,
} from '@components/PicUpload/PicUpload.react';
import { render, toJSON, fireEvent } from '@testing-library/react-native';
import { pickImage } from '@utils';

jest.mock('@utils', () => ({
  pickImage: jest
    .fn()
    .mockRejectedValueOnce('failed')
    .mockReturnValueOnce(null)
    .mockReturnValueOnce({ uri: 'dummy_image_path' }),
}));

const setup = (propOverrides = {}) => {
  const props = {
    ...propOverrides,
  };
  return render(<PicUpload {...props} />);
};

describe('PicUpload component', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should display profile placeholder icon when type is profile and no photo uploaded', () => {
    const { getByTestId } = setup({
      type: PicUploadTypes.Profile,
    });
    expect(getByTestId('clickable').children.length).toBe(1);
    expect(getByTestId('profile placeholder')).toBeDefined();
  });

  it('should display media placeholder icon when type is media and no photo uploaded', () => {
    const { getByTestId } = setup();
    expect(getByTestId('clickable').children.length).toBe(1);
    expect(getByTestId('media placeholder')).toBeDefined();
  });

  it('should display placeholder icon with no image when error in pickImage', async () => {
    jest.useRealTimers();
    const { getByTestId } = setup({
      type: PicUploadTypes.Profile,
    });
    fireEvent.press(getByTestId('clickable'));
    await new Promise((resolve) => setTimeout(resolve, 500)); // await the call
    expect(getByTestId('profile placeholder')).toBeDefined();
  });

  it('should display placeholder icon with no image when pickImage cancelled', async () => {
    jest.useRealTimers();
    const { getByTestId } = setup({
      type: PicUploadTypes.Profile,
    });
    fireEvent.press(getByTestId('clickable'));
    await new Promise((resolve) => setTimeout(resolve, 500)); // await the call
    expect(getByTestId('profile placeholder')).toBeDefined();
  });

  it('should display an image with path when pickImage succeeds', async () => {
    jest.useRealTimers();
    const { getByTestId } = setup({ type: PicUploadTypes.Profile });
    fireEvent.press(getByTestId('clickable'));
    await new Promise((resolve) => setTimeout(resolve, 500)); // await the call
    expect(getByTestId('clickable').children.length).toBe(2);
    expect(getByTestId('clickable').children[0].props.source.uri).toBe(
      'dummy_image_path'
    );
  });
});
