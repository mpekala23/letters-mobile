import React, { useCallback, Dispatch, useState } from "react";
import { Text, View } from "react-native";
import { Colors, Typography } from "@styles";
import { Button, Icon } from "@components";
import MailHearts from "assets/views/Report/MailHearts";
import ReportStyles from "./Report.styles";
import { AppStackParamList } from "navigations";
import { StackNavigationProp } from "@react-navigation/stack";

type ThanksScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  "Thanks"
>;

interface Props {
  navigation: ThanksScreenNavigationProp;
}

const ThanksScreen: React.FC<Props> = (props) => {
  return (
    <View style={ReportStyles.background}>
      <Text
        style={[
          Typography.FONT_BOLD,
          ReportStyles.question,
          { marginHorizontal: 40 },
        ]}
      >
        Thanks for giving us feedback! We'll get in touch with you soon.
      </Text>
      <Icon svg={MailHearts} style={{ marginTop: 30, left: 15 }} />
      <Button
        buttonText="Return home"
        onPress={() => {
          props.navigation.navigate("Home");
        }}
        containerStyle={{ width: "100%", marginTop: 30 }}
      />
    </View>
  );
};

export default ThanksScreen;
