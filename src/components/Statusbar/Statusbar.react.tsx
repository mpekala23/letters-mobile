import React, { createRef } from 'react';
import { View, StatusBar } from 'react-native';
import { STATUS_BAR_HEIGHT } from '@utils';

/**
A component to go at the top of the screen behind native status bar on different devices.
*/
class Statusbar extends React.Component<
  Record<string, unknown>,
  { backgroundColor: string }
> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = {
      backgroundColor: 'white',
    };
  }

  render(): JSX.Element {
    return (
      <View
        style={{
          zIndex: 998,
        }}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={this.state.backgroundColor}
        />
      </View>
    );
  }
}

const statusRef = createRef<Statusbar>();
const StatusbarInstance = (): JSX.Element => (
  <Statusbar ref={statusRef} key="Status" />
);

export function setStatusBackground(color: string): void {
  if (statusRef.current) statusRef.current.setState({ backgroundColor: color });
}

export default StatusbarInstance;
