import React from 'react';
import { IssuesDetailScreen } from '@views';
import { DeliveryReportTypes } from 'types';
import { render, fireEvent, toJSON } from '@testing-library/react-native';
import { facebookShare } from '@api';

jest.mock('@api', () => ({
  facebookShare: jest.fn(),
}));

const setup = (issueOverrides: Record<string, unknown>) => {
  const navigation = { navigate: jest.fn() };
  const route = {
    params: { issue: '', ...issueOverrides },
  };
  return {
    navigation,
    route,
    ...render(<IssuesDetailScreen navigation={navigation} route={route} />),
  };
};

describe('Issues Detail screen', () => {
  it('should match snapshot', () => {
    const { container } = setup(<IssuesDetailScreen />);
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should make api call when issue RECEIVED button #1 is pressed', async () => {
    const { getByText } = setup({
      issue: DeliveryReportTypes.received,
    });
    const shareUrl =
      'https://www.facebook.com/sharer/sharer.php?u=letters.ameelio.org';
    const shareButton = getByText('Share on Facebook');
    fireEvent.press(shareButton);
    expect(facebookShare).toHaveBeenCalledWith(shareUrl);
  });

  it('should navigate to Home screen when issue RECEIVED button #2 is pressed', async () => {
    const { navigation, getByText } = setup({
      issue: DeliveryReportTypes.received,
    });
    fireEvent.press(getByText('Return home'));
    expect(navigation.navigate).toHaveBeenCalledWith('ContactSelector');
  });

  it('should navigate to Home screen when issue UNSURE button #1 is pressed', async () => {
    const { navigation, getByText } = setup({
      issue: DeliveryReportTypes.unsure,
    });
    fireEvent.press(getByText('Return home'));
    expect(navigation.navigate).toHaveBeenCalledWith('ContactSelector');
  });

  it('should navigate to IssuesDetailSecondary screen when issue NotYetReceived button #1 is pressed', async () => {
    const { navigation, getByText } = setup({
      issue: DeliveryReportTypes.notYetReceived,
    });
    fireEvent.press(getByText("I haven't asked my loved one!"));
    expect(navigation.navigate).toHaveBeenCalledWith('IssuesDetailSecondary', {
      issue: DeliveryReportTypes.haveNotAsked,
    });
  });

  it('should navigate to IssuesDetailSecondary screen when issue NotYetReceived button #2 is pressed', async () => {
    const { navigation, getByText } = setup({
      issue: DeliveryReportTypes.notYetReceived,
    });
    fireEvent.press(getByText("They haven't received the letter yet"));
    expect(navigation.navigate).toHaveBeenCalledWith('IssuesDetailSecondary', {
      issue: DeliveryReportTypes.haveNotReceived,
    });
  });
});
