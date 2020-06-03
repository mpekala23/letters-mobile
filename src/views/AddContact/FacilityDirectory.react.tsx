import React from "react";
import { View } from "react-native";
import { Colors, Typography } from "@styles";
import { AppStackParamList } from "navigations";
import { StackNavigationProp } from "@react-navigation/stack";

type ContactInfoScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  "FacilityDirectory"
>;

export interface Props {
  navigation: ContactInfoScreenNavigationProp;
}

class FacilityDirectoryScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Typography.PageHeader text="Facility Directory" />
      </View>
    );
  }
}

export default FacilityDirectoryScreen;
