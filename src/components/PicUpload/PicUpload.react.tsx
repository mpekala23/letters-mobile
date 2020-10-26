import React from 'react';
import {
  TouchableOpacity,
  ViewStyle,
  View,
  Linking,
  Keyboard,
  Text,
} from 'react-native';
import i18n from '@i18n';
import { pickImage, takeImage } from '@utils';
import { Image } from 'types';
import Camera from '@assets/components/PicUpload/Camera';
import Placeholder from '@assets/components/PicUpload/Placeholder';
import Delete from '@assets/components/PicUpload/Delete';
import Avatar from '@assets/components/ProfilePic/Avatar';
import { popupAlert } from '@components/Alert/Alert.react';
import { Colors, Typography } from '@styles';
import * as Segment from 'expo-analytics-segment';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import AdjustableText from '@components/Text/AdjustableText.react';
import Icon from '../Icon/Icon.react';
import Styles from './PicUpload.style';
import AsyncImage from '../AsyncImage/AsyncImage.react';

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
  onSuccess?: (image: Image) => void;
  onDelete?: (imageUri?: string) => void;
  aspect: [number, number];
  allowsEditing: boolean;
  initial: Image;
  segmentOnPressLog?: () => void;
  segmentSuccessLog?: () => void;
  segmentErrorLogEvent?: string;
  avatarPlaceholder?: boolean;
  maintainStateImage: boolean;
  oneCreditWarning?: boolean;
}

export interface State {
  image: Image | null;
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
    avatarPlaceholder: false,
    maintainStateImage: true,
    oneCreditWarning: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      image: props.initial,
    };
  }

  getImage = (): Image | null => {
    return this.state.image;
  };

  // returns height, width
  getDimensions = (result: ImageInfo): [number, number] => {
    if (this.props.type === PicUploadTypes.Profile) {
      const minDim = Math.min(result.width, result.height);
      return [minDim, minDim];
    }
    if (
      result.exif &&
      result.exif.Orientation &&
      result.exif.ImageLength &&
      result.exif.ImageWidth
    ) {
      if (result.exif.Orientation > 4)
        // image is rotated to be on its side
        return [result.exif.ImageWidth, result.exif.ImageLength];
      return [result.exif.ImageLength, result.exif.ImageWidth];
    }
    return [result.height, result.width];
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
                const [height, width] = this.getDimensions(result);
                const image = {
                  uri: result.uri,
                  type: 'image',
                  width,
                  height,
                };

                if (this.props.maintainStateImage) {
                  this.setState(
                    {
                      image,
                    },
                    () => {
                      if (this.props.onSuccess) {
                        this.props.onSuccess(image);
                        if (this.props.segmentSuccessLog)
                          this.props.segmentSuccessLog();
                      }
                    }
                  );
                } else if (this.props.onSuccess) {
                  this.props.onSuccess(image);
                  if (this.props.segmentSuccessLog)
                    this.props.segmentSuccessLog();
                }
              }
            } catch (err) {
              if (this.props.segmentErrorLogEvent)
                Segment.trackWithProperties(this.props.segmentErrorLogEvent, {
                  'Error Type': err,
                  'Photo Option': 'Take Photo',
                });
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
                const [height, width] = this.getDimensions(result);
                const image = {
                  uri: result.uri,
                  type: 'image',
                  width,
                  height,
                };
                if (this.props.maintainStateImage) {
                  this.setState(
                    {
                      image,
                    },
                    () => {
                      if (this.props.onSuccess) {
                        this.props.onSuccess(image);
                        if (this.props.segmentSuccessLog)
                          this.props.segmentSuccessLog();
                      }
                    }
                  );
                } else if (this.props.onSuccess) {
                  this.props.onSuccess(image);
                  if (this.props.segmentSuccessLog)
                    this.props.segmentSuccessLog();
                }
              }
            } catch (err) {
              if (this.props.segmentErrorLogEvent)
                Segment.trackWithProperties(this.props.segmentErrorLogEvent, {
                  'Error Type': err,
                  'Photo Option': 'Upload Existing Photo',
                });
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
    const imageUri = this.state.image?.uri;
    this.setState({ image: null }, () => {
      if (this.props.onDelete) this.props.onDelete(imageUri);
    });
  };

  render(): JSX.Element {
    const { image } = this.state;
    let innerCircle;
    if (image && image.uri.slice(-4) !== '.svg') {
      innerCircle = (
        <AsyncImage
          source={{ uri: image.uri }}
          viewStyle={{
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
            <Icon svg={this.props.avatarPlaceholder ? Avatar : Camera} />
          </View>
        ) : (
          <View
            testID="media placeholder"
            style={{
              width: 200,
              height: 200,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {this.props.oneCreditWarning && (
              <AdjustableText
                numberOfLines={1}
                style={[Typography.FONT_REGULAR, Styles.oneCreditWarningText]}
              >
                {i18n.t('Compose.oneCredit')}
              </AdjustableText>
            )}
            <View style={{ position: 'absolute', width: 200, height: 200 }}>
              <Icon svg={Placeholder} />
            </View>
          </View>
        );
    }

    return (
      <View
        style={
          this.props.type === PicUploadTypes.Profile
            ? { backgroundColor: Colors.GRAY_100, borderRadius: 100 }
            : {}
        }
      >
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
            if (this.props.segmentOnPressLog) this.props.segmentOnPressLog();
          }}
          disabled={image && image.uri.slice(-4) !== '.svg'}
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
      </View>
    );
  }
}

export default PicUpload;
