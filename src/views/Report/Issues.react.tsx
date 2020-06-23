import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Colors, Typography } from '@styles';
import { Button } from '@components';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import ReportStyles from './Report.styles';

type IssueScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Issues'
>;

interface Props {
  navigation: IssueScreenNavigationProp;
}
enum Problems {
  wasntReceived = "Letter wasn't received",
  delayed = 'Letter was delayed',
  other = 'Other',
}

const IssuesScreen: React.FC<Props> = (props: Props) => {
  const [selected, setSelected] = useState<Problems | null>(null);

  return (
    <View style={ReportStyles.background}>
      <Text
        style={[
          Typography.FONT_BOLD,
          ReportStyles.question,
          { marginHorizontal: 10, marginBottom: 50 },
        ]}
      >
        Did you have one of these issues?
      </Text>
      <Button
        buttonText={Problems.wasntReceived}
        onPress={() => {
          setSelected(
            selected === Problems.wasntReceived ? null : Problems.wasntReceived
          );
        }}
        containerStyle={
          selected === Problems.wasntReceived
            ? { backgroundColor: Colors.SELECT, width: '100%' }
            : { width: '100%' }
        }
        textStyle={
          selected === Problems.wasntReceived ? { color: 'white' } : {}
        }
        reverse
      />
      <Button
        buttonText={Problems.delayed}
        onPress={() => {
          setSelected(selected === Problems.delayed ? null : Problems.delayed);
        }}
        containerStyle={
          selected === Problems.delayed
            ? { backgroundColor: Colors.SELECT, width: '100%' }
            : { width: '100%' }
        }
        textStyle={selected === Problems.delayed ? { color: 'white' } : {}}
        reverse
      />
      <Button
        buttonText={Problems.other}
        onPress={() => {
          setSelected(selected === Problems.other ? null : Problems.other);
        }}
        containerStyle={
          selected === Problems.other
            ? { backgroundColor: Colors.SELECT, width: '100%' }
            : { width: '100%' }
        }
        textStyle={selected === Problems.other ? { color: 'white' } : {}}
        reverse
      />
      <Button
        buttonText="Report the problem"
        onPress={() => {
          if (selected === Problems.other)
            props.navigation.navigate('ExplainProblem');
          else props.navigation.navigate('Thanks');
        }}
        containerStyle={{ marginTop: 40, width: '100%' }}
        enabled={!!selected}
      />
    </View>
  );
};

export default IssuesScreen;
