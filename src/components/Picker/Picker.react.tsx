import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  Ref,
} from 'react';
import { View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Entypo from 'react-native-vector-icons/Entypo';
import Styles, { pickerStyles } from './Picker.styles';

export interface Props {
  items: string[];
  placeholder: string;
  onValueChange: (v: string) => void;
}

export interface PickerRef {
  isValueSelected: () => boolean;
  value: string;
  setValue: (v: string) => void;
  setIsStoredValue: (isStored: boolean) => void;
}

const Picker = forwardRef((props: Props, ref: Ref<PickerRef>) => {
  const [value, setValue] = useState('');
  const [dirty, setDirty] = useState(false);
  const [isStoredValue, setIsStoredValue] = useState(false);
  const { items, placeholder, onValueChange } = props;

  function isValueSelected(): boolean {
    return !(value === '');
  }

  useImperativeHandle(ref, () => ({
    isValueSelected,
    value,
    setValue,
    setIsStoredValue,
  }));

  useEffect(() => {
    onValueChange(value);
  }, [value, isStoredValue]);

  let validityStyle = {};
  if (dirty) {
    validityStyle = isValueSelected()
      ? Styles.valueSelected
      : Styles.noValueSelected;
  }

  return (
    <View style={[Styles.pickerContainer, validityStyle]}>
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
          if (isStoredValue) {
            setIsStoredValue(false);
            setDirty(false);
          } else {
            setDirty(true);
          }
        }}
        Icon={() => {
          return <Entypo name="chevron-thin-down" size={16} color="gray" />;
        }}
      />
    </View>
  );
});

Picker.defaultProps = {
  items: [],
  placeholder: '',
  onValueChange: () => null,
};

export default Picker;
