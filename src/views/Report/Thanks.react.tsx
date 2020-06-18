import React from 'react';
import { Text, View } from 'react-native';
import { Typography } from '@styles';
import { Button, Icon } from '@components';
import MailHearts from '@assets/views/Report/MailHearts';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import ReportStyles from './Report.styles';

type ThanksScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Thanks'
>;

interface Props {
  navigation: ThanksScreenNavigationProp;
}

const ThanksScreen: React.FC<Props> = (props: Props) => {
  return (
    <View style={ReportStyles.background}>
      <Text
        style={[
          Typography.FONT_BOLD,
          ReportStyles.question,
          { marginHorizontal: 40 },
        ]}
      >
        Thanks for giving us feedback! We`&apos;`ll get in touch with you soon.
      </Text>
      <View testID="thanksSVG">
        <Icon svg={MailHearts} style={{ marginTop: 30, left: 15 }} />
      </View>
      <Button
        buttonText="Return home"
        onPress={() => {
          props.navigation.navigate('Home');
        }}
        containerStyle={{ width: '100%', marginTop: 30 }}
      />
    </View>
  );
};

export default ThanksScreen;
