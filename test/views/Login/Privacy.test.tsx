import * as React from 'react';
import { PrivacyScreen } from '@views';
import { render, toJSON } from '@testing-library/react-native';

describe('Terms of Service screen', () => {
  it('should match snapshot', () => {
    const { container } = render(<PrivacyScreen />);
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });
});
