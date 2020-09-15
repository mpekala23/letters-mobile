import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  Ref,
} from 'react';
import { View, ViewStyle } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Entypo from 'react-native-vector-icons/Entypo';
import Styles, { pickerStyles } from './Picker.styles';

export interface Props {
  parentStyle?: ViewStyle | ViewStyle[];
  items: string[];
  placeholder: string;
  onValueChange: (v: string) => void;
}

export interface PickerRef {
  isValueSelected: () => boolean;
  value: string;
  setStoredValue: (v: string, makeDirty?: boolean) => void;
}

const Picker = forwardRef((props: Props, ref: Ref<PickerRef>) => {
  const [value, setValue] = useState('');
  const [dirty, setDirty] = useState(false);
  const [styleIgnoresValueChange, setStyleIgnoresValueChange] = useState(false);
  const { parentStyle, items, placeholder, onValueChange } = props;

  function isValueSelected(): boolean {
    return !(value === '');
  }

  // default: sets value without immediately triggering container style change.
  // setting makeDirty=true triggers container style change
  function setStoredValue(v: string, makeDirty?: boolean): void {
    if (v && v !== value) {
      setStyleIgnoresValueChange(makeDirty !== true);
      setValue(v);
    }
  }

  useImperativeHandle(ref, () => ({
    isValueSelected,
    value,
    setStoredValue,
  }));

  useEffect(() => {
    onValueChange(value);
  }, [value, styleIgnoresValueChange]);

  let checkValueStyle = {};
  if (dirty) {
    checkValueStyle = isValueSelected()
      ? Styles.valueSelected
      : Styles.noValueSelected;
  }

  return (
    <View style={[Styles.pickerContainer, checkValueStyle, parentStyle]}>
      <RNPickerSelect
        placeholder={{ label: placeholder, value: '' }}
        items={items.map((item) => {
          return { key: item, label: item, value: item };
        })}
        useNativeAndroidPickerStyle={false}
        style={pickerStyles}
        value={value}
        onValueChange={(v) => {
          setValue(v);
          setDirty(!styleIgnoresValueChange);
          if (styleIgnoresValueChange) setStyleIgnoresValueChange(false);
        }}
        Icon={() => {
          return <Entypo name="chevron-thin-down" size={16} color="gray" />;
        }}
      />
    </View>
  );
});

Picker.defaultProps = {
  parentStyle: {},
  items: [],
  placeholder: '',
  onValueChange: () => null,
};

export default Picker;
