import React, { useState } from 'react';
import { Text, View, Image as ImageComponent } from 'react-native';
import i18n from '@i18n';
import { Icon, Button, AdjustableText } from '@components';
import LogoSmallGrey from '@assets/views/Onboarding/LogoSmallGrey';
import { Colors, Typography } from '@styles';
import { AuthStackParamList, Screens } from '@utils/Screens';
import { StackNavigationProp } from '@react-navigation/stack';
import LovedOnes from '@assets/views/Onboarding/LovedOnes';
import Screen1Background from '@assets/views/Begin/Screen1Background.png';
import Screen1EnglishTag from '@assets/views/Begin/Screen1EnglishTag.png';
import Screen2Image from '@assets/views/Begin/Screen2Image.png';
import Screen3Image from '@assets/views/Begin/Screen3Image.png';
import Screen4Image from '@assets/views/Begin/Screen4Image.png';
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
              height: WINDOW_HEIGHT * 0.5,
              resizeMode: 'cover',
            }}
          />
          <View style={[Styles.padded, { flex: 1 }]}>
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
        <View
          style={[
            Styles.page,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <Text
            style={[
              Typography.FONT_BOLD,
              {
                fontSize: 21,
                padding: 32,
                alignItems: 'center',
                textAlign: 'center',
              },
            ]}
          >
            {i18n.t('BeginScreen.sendEverything')}
          </Text>
          <ImageComponent
            source={Screen2Image}
            style={{
              width: '100%',
              height: WINDOW_HEIGHT * 0.5,
              resizeMode: 'contain',
            }}
          />
        </View>
        <View
          style={[
            Styles.page,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <Text
            style={[
              Typography.FONT_BOLD,
              {
                fontSize: 21,
                padding: 32,
                alignItems: 'center',
                textAlign: 'center',
              },
            ]}
          >
            {i18n.t('BeginScreen.theyllReceive')}
          </Text>
          <ImageComponent
            source={Screen3Image}
            style={{
              width: '100%',
              height: WINDOW_HEIGHT * 0.5,
              resizeMode: 'contain',
            }}
          />
        </View>
        <View
          style={[
            Styles.page,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <Text
            style={[
              Typography.FONT_BOLD,
              {
                fontSize: 21,
                padding: 32,
                alignItems: 'center',
                textAlign: 'center',
              },
            ]}
          >
            {i18n.t('BeginScreen.joinOurCommunity')}
          </Text>
          <ImageComponent
            source={Screen4Image}
            style={{
              width: '100%',
              height: WINDOW_HEIGHT * 0.5,
              resizeMode: 'contain',
            }}
          />
        </View>
      </ViewPager>
      <View style={Styles.swipePositionBackground}>
        <View
          style={[
            Styles.swipeCircle,
            { backgroundColor: swipePosition === 0 ? '#414141' : '#C4C4C4' },
          ]}
        />
        <View
          style={[
            Styles.swipeCircle,
            { backgroundColor: swipePosition === 1 ? '#414141' : '#C4C4C4' },
          ]}
        />
        <View
          style={[
            Styles.swipeCircle,
            { backgroundColor: swipePosition === 2 ? '#414141' : '#C4C4C4' },
          ]}
        />
        <View
          style={[
            Styles.swipeCircle,
            { backgroundColor: swipePosition === 3 ? '#414141' : '#C4C4C4' },
          ]}
        />
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
