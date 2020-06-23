import React from 'react';
import {
  Alert,
  TouchableOpacity,
  ViewStyle,
  Text,
  View,
  Image,
  Linking,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import i18n from '@i18n';
import { Colors } from '@styles';
import Styles from './PicUpload.style';

export enum PicUploadTypes {
  Profile = 'Profile',
  Media = 'Media',
}

export interface Props {
  type: PicUploadTypes;
  shapeBackground: ViewStyle;
  children?: JSX.Element;
  width: number;
  height: number;
  onSuccess?: (path: string) => void;
  onDelete?: () => void;
}

export interface State {
  image: string | null;
}

class PicUpload extends React.Component<Props, State> {
  static defaultProps = {
    type: PicUploadTypes.Media,
    shapeBackground: {},
    width: 100,
    height: 100,
  };

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

  getImage = (): string | null => {
    return this.state.image;
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
        this.setState({ image: result.uri }, () => {
          if (this.props.onSuccess) this.props.onSuccess(result.uri);
        });
      }
    } catch (E) {
      Alert.alert(
        i18n.t('Error.photoPermission'),
        i18n.t('Permissions.photos'),
        [
          { text: 'Dismiss' },
          { text: 'Settings', onPress: () => Linking.openURL('app-settings:') },
        ]
      );
    }
  };

  deleteImage = (): void => {
    this.setState({ image: '' }, () => {
      if (this.props.onDelete) this.props.onDelete();
    });
  };

  render(): JSX.Element {
    const { image } = this.state;
    let innerCircle;
    if (image) {
      innerCircle = (
        <Image
          source={{ uri: image }}
          style={{ width: this.props.width, height: this.props.height }}
        />
      );
    } else if (this.props.children) {
      innerCircle = this.props.children;
    } else {
      innerCircle =
        this.props.type === PicUploadTypes.Profile ? <View /> : <Text>+</Text>;
    }

    return (
      <TouchableOpacity
        style={[
          { width: this.props.width, height: this.props.height },
          this.props.type === PicUploadTypes.Profile
            ? Styles.profileBackground
            : Styles.mediaBackground,
          this.props.shapeBackground,
        ]}
        onPress={this.pickImage}
        testID="clickable"
      >
        {innerCircle}
        {image ? (
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: Colors.AMEELIO_RED,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={this.deleteImage}
          >
            <Text>X</Text>
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
    );
  }
}

export default PicUpload;
