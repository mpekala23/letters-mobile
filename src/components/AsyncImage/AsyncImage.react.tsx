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
import { getImageDims, sleep } from '@utils';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
  source: Image;
  viewStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  loadingSize?: number;
  timeout: number;
  download?: boolean;
  local?: boolean;
  accessibilityLabel?: string;
  onLoad?: () => void;
  autorotate?: boolean;
  loadingBackgroundColor: string;
}

interface State {
  loaded: boolean;
  timedOut: boolean;
  loadOpacity: Animated.Value;
  imgURI?: string;
  viewWidth: number;
  viewHeight: number;
  imageWidth: number;
  imageHeight: number;
}

class AsyncImage extends React.Component<Props, State> {
  static defaultProps = {
    viewStyle: { flex: 1 },
    imageStyle: { flex: 1 },
    loadingSize: 30,
    timeout: 10000,
    download: false,
    local: false,
    autorotate: true,
    loadingBackgroundColor: 'rgba(255,255,255,0.2)',
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      loaded: false,
      timedOut: false,
      imgURI: undefined,
      loadOpacity: new Animated.Value(0.3),
      viewWidth: 200,
      viewHeight: 200,
      imageWidth: 200,
      imageHeight: 200,
    };
    this.loadImage = this.loadImage.bind(this);
  }

  async componentDidMount(): Promise<void> {
    this.testTimeout();
    if (!this.props.local) await this.loadImage();
  }

  componentDidUpdate(prevProps: Props): void {
    if (this.props.local) return;
    if (prevProps.source.uri === this.props.source.uri) return;
    this.loadImage();
  }

  testTimeout = async (): Promise<void> => {
    await sleep(this.props.timeout);
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

  loadFinished(imgURI?: string): void {
    if (this.props.onLoad) this.props.onLoad();
    if (!imgURI || this.props.local) {
      this.setState({
        loaded: true,
        timedOut: false,
        imgURI,
      });
      Animated.timing(this.state.loadOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      return;
    }
    getImageDims(imgURI)
      .then(({ width, height }) => {
        this.setState({
          imageWidth: width,
          imageHeight: height,
        });
      })
      .catch(() => null);
    this.setState({
      loaded: true,
      timedOut: false,
      imgURI,
    });
    Animated.timing(this.state.loadOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  async loadImage(): Promise<void> {
    this.setState({
      loaded: false,
      timedOut: false,
      loadOpacity: new Animated.Value(0.6),
    });
    const filesystemURI = await this.getImageFilesystemKey(
      this.props.source.uri
    );
    const remoteURI = this.props.source.uri;
    try {
      // Use the cached image if it exists
      const metadata = await FileSystem.getInfoAsync(filesystemURI);
      if (metadata.exists) {
        this.loadFinished(filesystemURI);
        return;
      }
      // If no cached image exists and download is false default to remote
      if (!this.props.download) {
        this.loadFinished(remoteURI);
        return;
      }
      // otherwise download to cache
      const imageObject = await FileSystem.downloadAsync(
        remoteURI,
        filesystemURI
      );
      this.loadFinished(imageObject.uri);
      return;
    } catch (err) {
      this.setState({ loaded: false, imgURI: remoteURI });
    }
  }

  render(): JSX.Element {
    let asyncFeedback: JSX.Element = <View />;
    const viewIsHorizontal = this.state.viewWidth >= this.state.viewHeight;
    const imageIsHorizontal = this.state.imageWidth >= this.state.imageHeight;

    let renderedImage: JSX.Element;
    if (
      (viewIsHorizontal && imageIsHorizontal) ||
      (!viewIsHorizontal && !imageIsHorizontal) ||
      !this.props.autorotate
    ) {
      renderedImage = (
        <Animated.Image
          source={
            this.props.local
              ? this.props.source
              : {
                  uri: this.state.imgURI,
                }
          }
          style={[
            this.props.imageStyle,
            {
              width: this.state.viewWidth,
              height: this.state.viewHeight,
              opacity: this.state.loadOpacity,
            },
          ]}
          loadingIndicatorSource={Loading}
          onLoad={() => {
            if (this.props.local) this.loadFinished();
          }}
        />
      );
    } else {
      renderedImage = (
        <View
          style={{
            width: this.state.viewHeight,
            height: this.state.viewWidth,
            transform: [{ rotateZ: '270deg' }],
          }}
        >
          <Animated.Image
            source={{
              uri: this.state.imgURI,
            }}
            style={[
              this.props.imageStyle,
              {
                width: '100%',
                height: '100%',
                opacity: this.state.loadOpacity,
              },
            ]}
            loadingIndicatorSource={Loading}
            onLoad={() => {
              if (this.props.local) this.loadFinished();
            }}
          />
        </View>
      );
    }

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
              backgroundColor: this.props.loadingBackgroundColor,
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
              backgroundColor: this.props.loadingBackgroundColor,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={async () => {
              this.setState({
                loaded: false,
                timedOut: false,
              });
              this.testTimeout();
              if (!this.props.local) await this.loadImage();
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
        style={[
          {
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          },
          this.props.viewStyle,
        ]}
        accessibilityLabel={this.props.accessibilityLabel}
        onLayout={(e: {
          nativeEvent: { layout: { width: number; height: number } };
        }) => {
          this.setState({
            viewWidth: e.nativeEvent.layout.width,
            viewHeight: e.nativeEvent.layout.height,
          });
        }}
      >
        {(!!this.props.source.uri || this.props.local) &&
          (!!this.state.imgURI || this.props.local) &&
          renderedImage}
        {asyncFeedback}
      </View>
    );
  }
}

export default AsyncImage;
