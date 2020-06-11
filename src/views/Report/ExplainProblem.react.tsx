import React, { useCallback, Dispatch, useState } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { Colors, Typography } from "@styles";
import { Button } from "@components";
import MailHearts from "assets/views/Report/MailHearts";
import ReportStyles from "./Report.styles";
import { AppStackParamList } from "navigations";
import { StackNavigationProp } from "@react-navigation/stack";

type ExplainProblemScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  "ExplainProblem"
>;

interface Props {
  navigation: ExplainProblemScreenNavigationProp;
}

// TODO: Refine this View once coordinating with copy
const ExplainProblemScreen: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={1.0}
      onPress={Keyboard.dismiss}
      style={{ flex: 1 }}
    >
      <View style={ReportStyles.background}>
        <Text style={[Typography.FONT_BOLD, ReportStyles.question]}>
          Report problem
        </Text>
        <View style={ReportStyles.textAreaBox}>
          <TextInput
            style={[Typography.FONT_REGULAR, ReportStyles.textAreaText]}
            placeholder="Type something"
            placeholderTextColor="grey"
            numberOfLines={10}
            multiline={true}
          />
        </View>
        <Button
          buttonText="Report the problem"
          onPress={() => {
            props.navigation.navigate("Thanks");
          }}
          containerStyle={{ width: "100%", marginTop: 30 }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ExplainProblemScreen;
