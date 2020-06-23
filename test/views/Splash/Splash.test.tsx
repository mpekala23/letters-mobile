import * as React from 'react';
import { SplashScreen } from '@views';
import { render, toJSON } from '@testing-library/react-native';

describe('Splash screen', () => {
  it('should match snapshot', () => {
    const { container } = render(<SplashScreen />);
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should show the logo', () => {
    const { getByLabelText } = render(<SplashScreen />);
    expect(getByLabelText('Ameelio Logo')).toBeDefined();
  });
});
