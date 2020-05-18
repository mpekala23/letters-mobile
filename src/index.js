import * as React from 'react';
import { Provider } from 'react-redux';
import store from 'store';
import Navigator from 'navigations';

export default function App() {
  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  );
}
