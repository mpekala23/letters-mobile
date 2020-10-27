import React from 'react';
import { Keyboard, TouchableOpacity, View } from 'react-native';
import BackButton from '@assets/components/Topbar/BackButton';
import Icon from '@components/Icon/Icon.react';
import { TopbarLeft } from 'types';
import { AppState } from '@store/types';
import { connect } from 'react-redux';
import Styles from './Topbar.styles';

interface Props {
  topbarLeft: TopbarLeft | null;
  onPress?: () => void;
  canGoBack?: boolean;
}

const HeaderLeftBase: React.FC<Props> = ({
  topbarLeft,
  onPress,
  canGoBack,
}: Props) => (
  <View style={[Styles.sideContainer, Styles.leftContainer]}>
    <TouchableOpacity
      onPress={() => {
        Keyboard.dismiss();
        if (topbarLeft) {
          if (topbarLeft.action) topbarLeft.action();
        } else if (onPress) {
          onPress();
        }
      }}
      style={{
        width: 40,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {(canGoBack || topbarLeft?.canGoBack) && <Icon svg={BackButton} />}
    </TouchableOpacity>
  </View>
);

HeaderLeftBase.defaultProps = {
  onPress: () => null,
  canGoBack: false,
};

const mapStateToProps = (state: AppState) => ({
  topbarLeft: state.ui.topbarLeft,
});
const HeaderLeft = connect(mapStateToProps)(HeaderLeftBase);

export default HeaderLeft;
