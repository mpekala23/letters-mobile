import React from 'react';
import {
  TouchableOpacity,
  ViewStyle,
  View,
  Image,
  Linking,
  Keyboard,
} from 'react-native';
import i18n from '@i18n';
import { pickImage, takeImage } from '@utils';
import { Photo } from 'types';
import Camera from '@assets/components/PicUpload/Camera';
import Placeholder from '@assets/components/PicUpload/Placeholder';
import Delete from '@assets/components/PicUpload/Delete';
import { popupAlert } from '@components/Alert/Alert.react';
import Icon from '../Icon/Icon.react';
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
  onSuccess?: (image: Photo) => void;
  onDelete?: () => void;
  aspect: [number, number];
  allowsEditing: boolean;
  initial: Photo;
}

export interface State {
  image: Photo | null;
}

class PicUpload extends React.Component<Props, State> {
  static defaultProps = {
    type: PicUploadTypes.Media,
    shapeBackground: {},
    width: 100,
    height: 100,
    aspect: [3, 3],
    allowsEditing: true,
    initial: null,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      image: props.initial,
    };
  }

  getImage = (): Photo | null => {
    return this.state.image;
  };

  selectImage = async (): Promise<void> => {
    popupAlert({
      title: i18n.t('Compose.uploadAnImage'),
      buttons: [
        {
          text: i18n.t('Compose.takePhoto'),
          onPress: async () => {
            try {
              const result = await takeImage({
                aspect: this.props.aspect,
                allowsEditing: this.props.allowsEditing,
              });
              if (result) {
                const image = {
                  uri: result.uri,
                  type: 'image',
                  width: result.width,
                  height: result.height,
                };
                this.setState(
                  {
                    image,
                  },
                  () => {
                    if (this.props.onSuccess) this.props.onSuccess(image);
                  }
                );
              }
            } catch (err) {
              popupAlert({
                title: i18n.t('Permission.photos'),
                buttons: [
                  {
                    text: i18n.t('Alert.goToSettings'),
                    onPress: () => Linking.openURL('app-settings:'),
                  },
                  {
                    text: i18n.t('Alert.okay'),
                    reverse: true,
                  },
                ],
              });
            }
          },
        },
        {
          text: i18n.t('Compose.uploadExistingPhoto'),
          reverse: true,
          onPress: async () => {
            try {
              const result = await pickImage({
                aspect: this.props.aspect,
                allowsEditing: this.props.allowsEditing,
              });
              if (result) {
                const image = {
                  uri: result.uri,
                  type: 'image',
                  width: result.width,
                  height: result.height,
                };
                this.setState(
                  {
                    image,
                  },
                  () => {
                    if (this.props.onSuccess) this.props.onSuccess(image);
                  }
                );
              }
            } catch (err) {
              popupAlert({
                title: i18n.t('Permission.photos'),
                buttons: [
                  {
                    text: i18n.t('Alert.goToSettings'),
                    onPress: () => Linking.openURL('app-settings:'),
                  },
                  {
                    text: i18n.t('Alert.okay'),
                    reverse: true,
                  },
                ],
              });
            }
          },
        },
      ],
    });
  };

  deleteImage = (): void => {
    this.setState({ image: null }, () => {
      if (this.props.onDelete) this.props.onDelete();
    });
  };

  render(): JSX.Element {
    const { image } = this.state;
    let innerCircle;
    if (image && image.uri.slice(-4) !== '.svg') {
      innerCircle = (
        <Image
          source={{ uri: image.uri }}
          style={{
            width:
              image.width && image.height
                ? (image.width / image.height) * this.props.height
                : this.props.width,
            height: this.props.height,
            aspectRatio:
              image.width && image.height ? image.width / image.height : 1,
          }}
        />
      );
    } else {
      innerCircle =
        this.props.type === PicUploadTypes.Profile ? (
          <View testID="profile placeholder">
            <Icon svg={Camera} />
          </View>
        ) : (
          <View testID="media placeholder">
            <Icon svg={Placeholder} />
          </View>
        );
    }

    return (
      <TouchableOpacity
        style={[
          {
            width:
              image && image.width && image.height
                ? (image.width / image.height) * this.props.height
                : this.props.width,
            height: this.props.height,
          },
          this.props.type === PicUploadTypes.Profile
            ? Styles.profileBackground
            : Styles.mediaBackground,
          this.props.shapeBackground,
        ]}
        onPress={() => {
          Keyboard.dismiss();
          this.selectImage();
        }}
        testID="clickable"
      >
        {innerCircle}
        {image && image.uri.slice(-4) !== '.svg' && (
          <TouchableOpacity
            style={[
              {
                position: 'absolute',
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              },
              this.props.type === PicUploadTypes.Profile
                ? Styles.profileDelete
                : Styles.mediaDelete,
            ]}
            onPress={this.deleteImage}
          >
            <Icon svg={Delete} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }
}

export default PicUpload;
