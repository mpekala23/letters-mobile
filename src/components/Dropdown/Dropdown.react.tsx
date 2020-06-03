import React, { createRef } from "react";
import DropdownAlert from "react-native-dropdownalert";

let dropdownRef = createRef<DropdownAlert>();

export function getDropdownRef() {
  return dropdownRef;
}

class Dropdown extends React.Component {
  render() {
    return (
      <DropdownAlert
        wrapperStyle={{
          zIndex: 20,
        }}
        ref={dropdownRef}
      />
    );
  }
}

export default Dropdown;
