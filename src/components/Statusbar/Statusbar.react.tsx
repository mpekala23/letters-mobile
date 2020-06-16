import React from 'react';
import { View, StatusBar } from 'react-native';
import { STATUS_BAR_HEIGHT } from 'utils';

/**
A component to go at the top of the screen behind native status bar on different devices.
*/
const Statusbar: React.FC = () => {
  return (
    <View style={{ height: STATUS_BAR_HEIGHT, zIndex: 999 }}>
      <StatusBar barStyle="dark-content" />
    </View>
  );
};

export default Statusbar;
