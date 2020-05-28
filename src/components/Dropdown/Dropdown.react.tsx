import * as React from "react";
import { Text, View } from "react-native";
import { Colors } from "styles";
import { Network } from "api";
import DropdownAlert from "react-native-dropdownalert";

let dropdownRef;

export function getDropdownRef() {
  return dropdownRef;
}

class Dropdown extends React.Component {
  onTap = (data) => {
    if (data.payload && data.payload.onTap) {
      data.payload.onTap();
    }
  };

  render() {
    return (
      <DropdownAlert
        wrapperStyle={{
          zIndex: 20,
        }}
        ref={(ref) => {
          dropdownRef = ref;
        }}
        onTap={this.onTap}
      />
    );
  }
}

export default Dropdown;
