import React from 'react';
import {
  Image as ImageComponent,
  View,
  ViewStyle,
  ImageStyle,
  Animated,
} from 'react-native';
import { Image } from 'types';
import Loading from '@assets/common/loading.gif';
import Warning from '@assets/common/Warning.png';
import { sleep } from '@utils';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
  source: Image;
  viewStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  loadingSize?: number;
  timeout?: number;
  download?: boolean;
  accessibilityLabel?: string;
}

interface State {
  loaded: boolean;
  timedOut: boolean;
  loadOpacity: Animated.Value;
  imgURI?: string;
}

class AsyncImage extends React.Component<Props, State> {
  static defaultProps = {
    viewStyle: { flex: 1 },
    imageStyle: { flex: 1 },
    loadingSize: 30,
    timeout: 10000,
    download: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      loaded: true,
      timedOut: false,
      imgURI: this.props.source.uri ? this.props.source.uri : undefined,
      loadOpacity: new Animated.Value(1.0),
    };
    this.loadImage = this.loadImage.bind(this);
  }

  async componentDidMount(): Promise<void> {
    this.testTimeout();
    await this.loadImage();
  }

  async componentDidUpdate(): Promise<void> {
    if (this.props.source.uri) {
      const filesystemURI = await this.getImageFilesystemKey(
        this.props.source.uri
      );
      if (
        this.props.source.uri === this.state.imgURI ||
        filesystemURI === this.state.imgURI
      ) {
        return;
      }
      await this.loadImage();
    }
  }

  testTimeout = async (): Promise<void> => {
    await sleep(this.props.timeout || 10000);
    if (!this.state.loaded) {
      this.setState({ timedOut: true });
    }
  };

  getImageFilesystemKey = async (remoteURI: string): Promise<string> => {
    const hashed = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      remoteURI
    );
    return `${FileSystem.cacheDirectory}${hashed}`;
  };

  async loadImage(): Promise<void> {
    const filesystemURI = await this.getImageFilesystemKey(
      this.props.source.uri
    );
    const remoteURI = this.props.source.uri;
    try {
      // Use the cached image if it exists
      const metadata = await FileSystem.getInfoAsync(filesystemURI);
      if (metadata.exists) {
        this.setState({
          imgURI: filesystemURI,
        });
        return;
      }
      // If no cached image exists and download is false default to remote
      if (!this.props.download) {
        this.setState({
          imgURI: remoteURI,
        });
        return;
      }
      this.setState({
        loaded: false,
        loadOpacity: new Animated.Value(0.3),
      });
      // otherwise download to cache
      const imageObject = await FileSystem.downloadAsync(
        remoteURI,
        filesystemURI
      );
      this.setState({
        imgURI: imageObject.uri,
      });
    } catch (err) {
      this.setState({ imgURI: remoteURI });
    }
  }

  render(): JSX.Element {
    let asyncFeedback: JSX.Element = <View />;
    if (!this.state.loaded) {
      // the image is still loading / timed out
      if (!this.state.timedOut) {
        // still loading
        asyncFeedback = (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ImageComponent
              source={Loading}
              style={{
                width: this.props.loadingSize,
                height: this.props.loadingSize,
              }}
            />
          </View>
        );
      } else {
        // timed out
        asyncFeedback = (
          <TouchableOpacity
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={async () => {
              this.setState({
                loaded: false,
                timedOut: false,
              });
              this.testTimeout();
              await this.loadImage();
            }}
          >
            <ImageComponent
              source={Warning}
              style={{
                width:
                  (this.props.loadingSize ? this.props.loadingSize : 30) * 1.5,
                height:
                  (this.props.loadingSize ? this.props.loadingSize : 30) * 1.5,
              }}
            />
          </TouchableOpacity>
        );
      }
    }
    return (
      <View
        style={this.props.viewStyle}
        accessibilityLabel={this.props.accessibilityLabel}
      >
        {this.props.source.uri && this.state.imgURI && (
          <Animated.Image
            source={{
              uri: this.state.imgURI,
            }}
            style={[this.props.imageStyle, { opacity: this.state.loadOpacity }]}
            onLoad={() => {
              if (this.props.source.uri && this.props.source.uri.length) {
                this.setState({
                  loaded: true,
                  timedOut: false,
                });
                Animated.timing(this.state.loadOpacity, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: true,
                }).start();
              }
            }}
          />
        )}
        {asyncFeedback}
      </View>
    );
  }
}

export default AsyncImage;
