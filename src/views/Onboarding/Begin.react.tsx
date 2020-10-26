import React, { useState } from 'react';
import { Text, View, Image as ImageComponent, ViewStyle } from 'react-native';
import i18n from '@i18n';
import { Button } from '@components';
import { Colors, Typography } from '@styles';
import { AuthStackParamList, Screens } from '@utils/Screens';
import { StackNavigationProp } from '@react-navigation/stack';
import Screen1Background from '@assets/views/Begin/Screen1Background.jpeg';
import Screen1EnglishTag from '@assets/views/Begin/Screen1EnglishTag.png';
import Screen2Image from '@assets/views/Begin/Screen2Image.jpeg';
import Screen3Image from '@assets/views/Begin/Screen3Image.jpeg';
import Screen4Image from '@assets/views/Begin/Screen4Image.jpeg';
import * as Segment from 'expo-analytics-segment';
import ViewPager from '@react-native-community/viewpager';
import { WINDOW_HEIGHT } from '@utils';
import Styles from './Begin.styles';

type BeginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Begin'
>;

interface Props {
  navigation: BeginScreenNavigationProp;
}

function getBallStyle(index: number, position: number): ViewStyle[] {
  return [
    Styles.swipeCircle,
    { backgroundColor: index === position ? '#414141' : '#C4C4C4' },
  ];
}

const BeginScreen: React.FC<Props> = (props: Props) => {
  const [swipePosition, setSwipePosition] = useState(0);

  return (
    <View style={Styles.trueBackground}>
      <ViewPager
        style={{ flex: 1 }}
        onPageSelected={(e) => {
          setSwipePosition(e.nativeEvent.position);
        }}
      >
        <View style={Styles.page}>
          <ImageComponent
            source={Screen1Background}
            style={{
              width: '100%',
              height: WINDOW_HEIGHT * 0.45,
              resizeMode: 'cover',
            }}
          />
          <View style={[Styles.padded, { flex: 1, width: '100%' }]}>
            <ImageComponent
              source={Screen1EnglishTag}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
              }}
            />
          </View>
        </View>
        <View style={[Styles.page]}>
          <Text style={[Typography.FONT_BOLD, Styles.screenTitle]}>
            {i18n.t('BeginScreen.sendEverything')}
          </Text>
          <ImageComponent source={Screen2Image} style={Styles.screenImage} />
        </View>
        <View style={[Styles.page]}>
          <Text style={[Typography.FONT_BOLD, Styles.screenTitle]}>
            {i18n.t('BeginScreen.theyllReceive')}
          </Text>
          <ImageComponent source={Screen3Image} style={Styles.screenImage} />
        </View>
        <View style={[Styles.page]}>
          <Text style={[Typography.FONT_BOLD, Styles.screenTitle]}>
            {i18n.t('BeginScreen.joinOurCommunity')}
          </Text>
          <ImageComponent source={Screen4Image} style={Styles.screenImage} />
        </View>
      </ViewPager>
      <View style={Styles.swipePositionBackground}>
        <View style={getBallStyle(0, swipePosition)} key={0} />
        <View style={getBallStyle(1, swipePosition)} key={1} />
        <View style={getBallStyle(2, swipePosition)} key={2} />
        <View style={getBallStyle(3, swipePosition)} key={3} />
      </View>
      <View style={Styles.buttonContainer}>
        <Button
          onPress={() => {
            props.navigation.navigate(Screens.RegisterCreds);
            Segment.track('Begin - Click on Sign Up');
          }}
          buttonText={i18n.t('BeginScreen.signUp')}
          textStyle={[Typography.FONT_SEMIBOLD, Styles.baseText]}
          containerStyle={{ height: 47 }}
        />
        <Button
          onPress={() => {
            props.navigation.navigate(Screens.Login);
            Segment.track('Begin - Click on Login');
          }}
          buttonText={i18n.t('BeginScreen.logIn')}
          reverse
          textStyle={[
            Typography.FONT_SEMIBOLD,
            Styles.baseText,
            { color: Colors.PINK_500 },
          ]}
          containerStyle={{ height: 47 }}
        />
      </View>
    </View>
  );
};

export default BeginScreen;
