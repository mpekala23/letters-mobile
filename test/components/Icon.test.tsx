import * as React from 'react';
import { Icon } from '@components';
import { render, toJSON } from '@testing-library/react-native';
import Mail from '@assets/views/Report/MailLoud';

describe('Icon component', () => {
  it('should match snapshot', () => {
    const { container } = render(<Icon svg={Mail} />);
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should show the logo', () => {
    const { container } = render(<Icon svg={Mail} />);
    expect(container.children[0].props.xml).toEqual(Mail);
  });
});
