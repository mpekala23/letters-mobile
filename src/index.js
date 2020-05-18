import * as React from 'react';
import { Provider } from 'react-redux';
import store from 'store';
import Navigator from 'navigations';
import { Statusbar } from 'components';

export default function App() {
  return (
    <Provider store={store}>
      <Statusbar />
      <Navigator />
    </Provider>
  );
}
