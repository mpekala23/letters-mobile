import React, { RefObject } from 'react';
import { Animated, TouchableOpacity, View, Keyboard, Text } from 'react-native';
import { Typography, Colors } from '@styles';
import { WINDOW_WIDTH } from '@utils';
import ImageIcon from '@assets/views/Compose/Image';
import CheckIcon from '@assets/views/Compose/Check';
import Icon from '../Icon/Icon.react';
import Styles from './ComposeTools.styles';
import PicUpload from '../PicUpload/PicUpload.react';

interface Props {
  keyboardOpacity: Animated.Value;
  numLeft: number;
  picRef?: RefObject<PicUpload>;
}

const ComposeTools: React.FC<Props> = (props: Props) => {
  return (
    <Animated.View
      style={{
        opacity: props.keyboardOpacity,
        position: 'absolute',
        bottom: 0,
        width: WINDOW_WIDTH,
        paddingVertical: 6,
      }}
    >
      <TouchableOpacity
        activeOpacity={1.0}
        style={Styles.keyboardButtonContainer}
      >
        <View style={[Styles.keyboardButtonItem, { flex: 1 }]}>
          <Text
            style={[
              Typography.FONT_REGULAR,
              {
                color:
                  props.numLeft >= 0 ? Colors.GRAY_DARK : Colors.AMEELIO_RED,
              },
            ]}
          >
            {props.numLeft} left
          </Text>
        </View>
        {props.picRef ? (
          <TouchableOpacity
            style={[Styles.keyboardButtonItem, { flex: 1 }]}
            onPress={async () => {
              Keyboard.dismiss();
              if (props.picRef && props.picRef.current) {
                await props.picRef.current.selectImage();
              }
            }}
          >
            <Icon svg={ImageIcon} />
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        <TouchableOpacity
          style={[Styles.keyboardButtonItem, { flex: 1 }]}
          onPress={Keyboard.dismiss}
        >
          <Icon svg={CheckIcon} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

ComposeTools.defaultProps = {
  picRef: undefined,
};

export default ComposeTools;
