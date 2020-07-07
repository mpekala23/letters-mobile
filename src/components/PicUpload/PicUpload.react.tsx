import React from 'react';
import { Image, TouchableOpacity, Linking } from 'react-native';
import { popupAlert } from '@components/Alert/Alert.react';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import i18n from '@i18n';
import Styles from './PicUpload.style';

export interface State {
  image: string | null;
}

class PicUpload extends React.Component<Record<string, unknown>, State> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = {
      image: null,
    };
  }

  getCameraRollPermission = async (): Promise<void> => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      popupAlert({
        title: i18n.t('Alert.weNeedProfilePermission'),
        message: i18n.t('Alert.goToSettingsToUpdate'),
        buttons: [
          {
            text: i18n.t('Alert.goToSettings'),
            reverse: false,
            onPress: () => {
              Linking.openURL('app-settings:');
            },
          },
          {
            text: i18n.t('Alert.maybeLater'),
            reverse: true,
            onPress: () => null,
          },
        ],
      });
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
    } catch (err) {
      dropdownError({ message: i18n.t('Permission.photos') });
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
