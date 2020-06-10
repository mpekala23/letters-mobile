import React, { createRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "@store";
import Navigator, { navigationRef } from "@navigations";
import { Dropdown, Statusbar } from "@components";
import { loadToken } from "@api";
import Notifs from "@notifications";

export default class App extends React.Component {
  async componentDidMount() {
    try {
      await loadToken();
    } catch (err) {}
    Notifs.setup();
  }

  componentWillUnmount() {
    Notifs.unsubscribe();
  }

  render() {
    return (
      <Provider store={store}>
        <Dropdown />
        <Statusbar />
        <NavigationContainer ref={navigationRef}>
          <Navigator />
        </NavigationContainer>
      </Provider>
    );
  }
}
