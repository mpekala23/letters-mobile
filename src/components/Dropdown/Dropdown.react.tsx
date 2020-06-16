import React, { createRef, RefObject } from 'react';
import DropdownAlert from 'react-native-dropdownalert';

const dropdownRef = createRef<DropdownAlert>();

export function getDropdownRef(): RefObject<DropdownAlert> {
  return dropdownRef;
}

class Dropdown extends React.Component {
  render(): JSX.Element {
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
