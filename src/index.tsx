/* eslint-disable global-require */
import React from 'react';
import { Provider } from 'react-redux';
import store, { persistor } from '@store';
import Navigator from '@navigations';
import { Alert, Dropdown, Statusbar } from '@components';
import { loginWithToken } from '@api';
import { PersistGate } from 'redux-persist/integration/react';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { setCustomText } from 'react-native-global-props';
import * as Segment from 'expo-analytics-segment';
import Constants from 'expo-constants';

const customFonts = {
  'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
  'Poppins-Light-Italic': require('./assets/fonts/Poppins-LightItalic.ttf'),
  'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
  'Poppins-Regular-Italic': require('./assets/fonts/Poppins-Italic.ttf'),
  'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
  'Poppins-Medium-Italic': require('./assets/fonts/Poppins-MediumItalic.ttf'),
  'Poppins-Bold': require('./assets/fonts/Poppins-SemiBold.ttf'),
  'Poppins-Bold-Italic': require('./assets/fonts/Poppins-SemiBoldItalic.ttf'),
};

const customTextProps = {
  style: {
    fontFamily: 'Poppins-Regular',
  },
};

export interface State {
  fontsLoaded: boolean;
}

export default class App extends React.Component<null, State> {
  constructor(props: null) {
    super(props);
    this.state = { fontsLoaded: false };
  }

  async componentDidMount(): Promise<void> {
    this.loadFontsAsync();
    const { androidWriteKey, iosWriteKey } = App.getSegmentWriteKeys([
      Constants.manifest.releaseChannel
        ? Constants.manifest.releaseChannel
        : '',
    ]);
    Segment.initialize({ androidWriteKey, iosWriteKey });
    Segment.track('App Open');
    try {
      await loginWithToken();
    } catch (err) {
      /* Unable to load token */
    }
  }

  componentWillUnmount(): void {
    Segment.track('App Closed');
  }

  static getSegmentWriteKeys(
    releaseChannel: Array<string> | undefined
  ): Record<string, string> {
    return {
      androidWriteKey: 'cveBC1HNczxB1HgrrquX8zjjfRAapEmx',
      iosWriteKey: 'EryEQcrwG2YGcPKFsPz8AGUTZ9Rdcqvi',
    };
    /* potentially broken release channel solution 
    if (releaseChannel && releaseChannel.indexOf('prod') !== -1)
      return {
        androidWriteKey: 'cveBC1HNczxB1HgrrquX8zjjfRAapEmx',
        iosWriteKey: 'EryEQcrwG2YGcPKFsPz8AGUTZ9Rdcqvi',
      };
    // On development or staging channels
    return {
      androidWriteKey: 'skQ1SzNOGHiOF2o5vkOCZzhl4QXykseD',
      iosWriteKey: 'emYpyC3ipSbi6XDHqaFn6mGuad2vn6Xy',
    }; */
  }

  async loadFontsAsync(): Promise<void> {
    await Font.loadAsync(customFonts);
    setCustomText(customTextProps);
    this.setState({ fontsLoaded: true });
  }

  render(): JSX.Element {
    if (this.state.fontsLoaded) {
      return (
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <Statusbar />
            <Navigator />
            <Alert />
            <Dropdown />
          </PersistGate>
        </Provider>
      );
    }
    return <AppLoading />;
  }
}
