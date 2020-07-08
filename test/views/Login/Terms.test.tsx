import * as React from 'react';
import { TermsScreen } from '@views';
import { render, toJSON } from '@testing-library/react-native';

describe('Terms of Service screen', () => {
  it('should match snapshot', () => {
    const { container } = render(<TermsScreen />);
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });
});
