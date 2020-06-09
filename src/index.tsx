import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "@store";
import Navigator from "@navigations";
import { Dropdown, Statusbar } from "@components";
import { loadToken } from "@api";

export default class App extends React.Component {
  async componentDidMount() {
    try {
      await loadToken();
    } catch (err) {}
  }

  render() {
    return (
      <Provider store={store}>
        <Statusbar />
        <Dropdown />
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </Provider>
    );
  }
}
