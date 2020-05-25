import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from '@store';
import Navigator from '@navigations';
import { Statusbar } from '@components';
import { loadToken } from '@api';

export default class App extends React.Component {
  componentDidMount() {
    loadToken();
  }

  render() {
    return (
      <Provider store={store}>
        <Statusbar />
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </Provider>
    );
  }
}
