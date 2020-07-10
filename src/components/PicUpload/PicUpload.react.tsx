import React from 'react';
import { TouchableOpacity, ViewStyle, View, Image } from 'react-native';
import i18n from '@i18n';
import { pickImage } from '@utils';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { Icon } from '@components';
import Camera from '@assets/views/PicUpload/Camera';
import Placeholder from '@assets/views/PicUpload/Placeholder';
import Delete from '@assets/views/PicUpload/Delete';
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

  getImage = (): string | null => {
    return this.state.image;
  };

  selectImage = async (): Promise<void> => {
    try {
      const result = await pickImage();
      if (result) {
        this.setState({ image: result.uri }, () => {
          if (this.props.onSuccess) this.props.onSuccess(result.uri);
        });
      }
    } catch (err) {
      dropdownError({ message: i18n.t('Permission.photos') });
    }
  };

  deleteImage = (): void => {
    this.setState({ image: null }, () => {
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
          style={{
            width: this.props.width,
            height: this.props.height,
          }}
        />
      );
    } else {
      innerCircle =
        this.props.type === PicUploadTypes.Profile ? (
          <View accessibilityLabel="profile placeholder">
            <Icon svg={Camera} />
          </View>
        ) : (
          <View accessibilityLabel="media placeholder">
            <Icon svg={Placeholder} />
          </View>
        );
    }

    return (
      <TouchableOpacity
        style={[
          {
            width: this.props.width,
            height: this.props.height,
            marginHorizontal: 8,
          },
          this.props.type === PicUploadTypes.Profile
            ? Styles.profileBackground
            : Styles.mediaBackground,
        ]}
        onPress={this.selectImage}
        testID="clickable"
      >
        {innerCircle}
        {image && (
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
