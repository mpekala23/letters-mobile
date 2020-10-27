import React from 'react';
import Button from '@components/Button/Button.react';
import { AppState } from '@store/types';
import { TopbarRight } from 'types';
import { Keyboard, View } from 'react-native';
import { connect } from 'react-redux';
import Styles from './Topbar.styles';

interface Props {
  topbarRight: TopbarRight | null;
}

const HeaderRightBase: React.FC<Props> = ({ topbarRight }: Props) => (
  <View style={[Styles.sideContainer, Styles.rightContainer]}>
    {topbarRight && (
      <Button
        enabled={topbarRight.enabled}
        blocking={topbarRight.blocking}
        onPress={async () => {
          Keyboard.dismiss();
          await topbarRight.action();
        }}
        buttonText={topbarRight.text}
        containerStyle={{ borderRadius: 20 }}
      />
    )}
  </View>
);

const mapStateToProps = (state: AppState) => ({
  topbarRight: state.ui.topbarRight,
});
const HeaderRight = connect(mapStateToProps)(HeaderRightBase);

export default HeaderRight;
