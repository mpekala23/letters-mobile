import React from 'react';
import {
  Image as ImageComponent,
  View,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { Image } from 'types';
import Loading from '@assets/common/loading.gif';
import Warning from '@assets/common/Warning.png';
import { sleep } from '@utils';
import Icon from '../Icon/Icon.react';

interface Props {
  source: Image;
  viewStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  loadingSize: number;
  timeout?: number;
}

interface State {
  loaded: boolean;
  timedOut: boolean;
}

export default class AsyncImage extends React.Component<Props, State> {
  static defaultProps = {
    viewStyle: { flex: 1 },
    imageStyle: { flex: 1 },
    loadingSize: 30,
    timeout: 1000,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      loaded: false,
      timedOut: false,
    };
    this.onLoad = this.onLoad.bind(this);
    this.testTimeout = this.testTimeout.bind(this);
  }

  componentDidMount(): void {
    this.testTimeout();
  }

  onLoad(): void {
    if (this.props.source.uri && this.props.source.uri !== '')
      this.setState({ loaded: true, timedOut: false });
  }

  async testTimeout(): Promise<void> {
    await sleep(this.props.timeout || 1000);
    if (!this.state.loaded) {
      this.setState({ timedOut: true });
    }
  }

  render(): JSX.Element {
    return (
      <View style={this.props.viewStyle}>
        <ImageComponent
          source={this.props.source}
          style={this.props.imageStyle}
          onLoad={this.onLoad}
        />
        {!this.state.loaded && (
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
            {!this.state.timedOut ? (
              <ImageComponent
                source={Loading}
                style={{
                  width: this.props.loadingSize,
                  height: this.props.loadingSize,
                }}
              />
            ) : (
              <ImageComponent
                source={Warning}
                style={{
                  width: this.props.loadingSize * 1.5,
                  height: this.props.loadingSize * 1.5,
                }}
              />
            )}
          </View>
        )}
      </View>
    );
  }
}
