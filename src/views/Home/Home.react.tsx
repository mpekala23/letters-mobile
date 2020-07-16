import React from 'react';
import { Text, ScrollView } from 'react-native';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from '@components';
import Notifs from '@notifications';
import { NotifTypes } from '@store/Notif/NotifTypes';

type HomeScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = (props: Props) => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <Text>Hello</Text>
      <Button
        buttonText="Contact Selector"
        onPress={() => props.navigation.navigate('ContactSelector')}
      />
      <Button
        buttonText="Send Notif"
        onPress={() => {
          Notifs.scheduleNotificationInHours(
            {
              title: 'Test Notif',
              body: 'Test body',
              data: {
                type: NotifTypes.FirstLetter,
              },
            },
            1 / 60 / 30
          );
        }}
      />
    </ScrollView>
  );
};

export default HomeScreen;
