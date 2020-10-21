import React, { createRef } from 'react';
import { Keyboard, TouchableOpacity, View } from 'react-native';
import BackButton from '@assets/components/Topbar/BackButton';
import Icon from '@components/Icon/Icon.react';
import { TopbarBackAction } from 'types';
import Styles from './Topbar.styles';

interface Props {
  canGoBack: boolean;
  onPress: (() => void) | undefined;
  route: string;
}

interface State {
  backOverride?: TopbarBackAction;
}

class HeaderLeftBase extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      backOverride: undefined,
    };
  }

  render() {
    return (
      <View style={[Styles.sideContainer, Styles.leftContainer]}>
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            if (this.state.backOverride) {
              this.state.backOverride.action();
            } else if (this.props.onPress) this.props.onPress();
          }}
          style={{
            width: 40,
            padding: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {this.props.canGoBack && <Icon svg={BackButton} />}
        </TouchableOpacity>
      </View>
    );
  }
}

const headerLeftRef = createRef<HeaderLeftBase>();

const HeaderLeft = ({
  canGoBack,
  onPress,
  route,
}: {
  canGoBack: boolean;
  onPress: (() => void) | undefined;
  route: string;
}): JSX.Element => (
  <HeaderLeftBase
    ref={headerLeftRef}
    canGoBack={canGoBack}
    onPress={onPress}
    route={route}
  />
);

export const setBackOverride = (
  backOverride: TopbarBackAction | undefined
): void => {
  if (headerLeftRef.current) headerLeftRef.current.setState({ backOverride });
};

export default HeaderLeft;
