import React from 'react';
import { View, Image } from 'react-native';
import AmeelioLogo from '@assets/Ameelio_Logo.png';
import Styles from './Topbar.styles';
import ProfilePic from '../ProfilePic/ProfilePic.react';

const Topbar: React.FC = () => {
  return (
    <View style={Styles.barContainer}>
      <View style={Styles.logoContainer}>
        <Image style={Styles.logo} source={AmeelioLogo} />
      </View>
      <View>
        <ProfilePic />
      </View>
    </View>
  );
};

export default Topbar;
