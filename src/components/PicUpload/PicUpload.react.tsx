import React, { createRef } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import DropdownAlert from 'react-native-dropdownalert';
import Styles from './PicUpload.style';

export interface Props {}

export interface State {
  image: string | null;
}

class PicUpload extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      image: null,
    };
  }

  getCameraRollPermission = async (): Promise<void> => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      Alert.alert(
        'We need permission to access your camera roll to upload a profile picture.'
      );
    }
  };

  pickImage = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }
    } catch (E) {
      dropdownError('Photo Upload', 'Unable to access the photo library.');
    }
  };

  render(): JSX.Element {
    const { image } = this.state;

    return (
      <TouchableOpacity
        style={Styles.shapeBackground}
        onPress={this.pickImage}
        testID="clickable"
      >
        {image && (
          <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
        )}
      </TouchableOpacity>
    );
  }
}

export default PicUpload;
