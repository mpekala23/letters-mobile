import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store, { persistor } from '@store';
import Navigator from '@navigations';
import { Dropdown, Statusbar } from '@components';
import { loginWithToken } from '@api';
import { PersistGate } from 'redux-persist/integration/react';

export default class App extends React.Component {
  async componentDidMount(): Promise<void> {
    try {
      await loginWithToken();
    } catch (err) {
      /* Unable to load token */
    }
  }

  render(): JSX.Element {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Statusbar />
          <Dropdown />
          <NavigationContainer>
            <Navigator />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    );
  }
}
