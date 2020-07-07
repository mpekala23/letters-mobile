import React from 'react';
import { TouchableOpacity, ViewStyle, Text, View, Image } from 'react-native';
import i18n from '@i18n';
import { Colors } from '@styles';
import { pickImage } from '@utils';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
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
          style={{ width: this.props.width, height: this.props.height }}
        />
      );
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
        onPress={this.selectImage}
        testID="clickable"
      >
        {innerCircle}
        {image && (
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
        )}
      </TouchableOpacity>
    );
  }
}

export default PicUpload;
