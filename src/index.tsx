/* eslint-disable global-require */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store, { persistor } from '@store';
import Navigator from '@navigations';
import { Dropdown, Statusbar } from '@components';
import { loginWithToken } from '@api';
import { PersistGate } from 'redux-persist/integration/react';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { setCustomText } from 'react-native-global-props';

const customFonts = {
  'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
  'Poppins-Light-Italic': require('./assets/fonts/Poppins-LightItalic.ttf'),
  'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
  'Poppins-Regular-Italic': require('./assets/fonts/Poppins-Italic.ttf'),
  'Poppins-Bold': require('./assets/fonts/Poppins-SemiBold.ttf'),
  'Poppins-Bold-Italic': require('./assets/fonts/Poppins-SemiBoldItalic.ttf'),
};

export default class App extends React.Component {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = {
      fontsLoaded: false,
    };
  }

  async componentDidMount(): Promise<void> {
    this.loadFontsAsync();
    try {
      await loginWithToken();
    } catch (err) {
      /* Unable to load token */
    }
  }

  async loadFontsAsync(): Promise<void> {
    await Font.loadAsync(customFonts);
    const customTextProps = {
      style: { fontFamily: 'Poppins-Regular' },
    };
    setCustomText(customTextProps);
    this.setState({ fontsLoaded: true });
  }

  render(): JSX.Element {
    if (this.state.fontsLoaded) {
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
    return <AppLoading />;
  }
}
