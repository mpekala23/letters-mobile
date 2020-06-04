import React from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { Colors, Typography } from "@styles";
import { AppStackParamList } from "navigations";
import { StackNavigationProp } from "@react-navigation/stack";
import Styles from "./FacilityDirectory.styles";
import { Button } from "components";

type ContactInfoScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  "FacilityDirectory"
>;

export interface Props {
  navigation: ContactInfoScreenNavigationProp;
}

const example = {
  name: "Yukon Kskokwim Correctional Center",
  type: "State Prison",
  address: "P.O. Box 400 - Bethel, AK 99559",
};

class FacilityDirectoryScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
  }

  renderItem({ item }) {
    return (
      <TouchableOpacity style={[Styles.shadow, Styles.itemBackground]}>
        <Text style={[Typography.FONT_BOLD, Styles.itemTitle]}>
          {item.name}
        </Text>
        <Text style={[Typography.FONT_ITALIC, Styles.itemInfo]}>
          {item.type}
        </Text>
        <Text style={[Typography.FONT_ITALIC, Styles.itemInfo]}>
          {item.address}
        </Text>
      </TouchableOpacity>
    );
  }

  renderFooter() {
    return (
      <View style={Styles.footerBackground}>
        <Text style={[Typography.FONT_REGULAR, { marginBottom: 20 }]}>
          Don't see the facility you're looking for?
        </Text>
        <Button buttonText="Add Manually" />
      </View>
    );
  }

  render() {
    return (
      <View style={Styles.facilityBackground}>
        <Typography.PageHeader text="Facility Directory" />
        <FlatList
          data={[example]}
          renderItem={this.renderItem}
          contentContainerStyle={Styles.flatBackground}
          ListFooterComponent={this.renderFooter}
          keyExtractor={(item) => item.name}
        />
        <View style={Styles.bottomButtonContainer}>
          <Button
            onPress={() => {
              this.props.navigation.navigate("ContactInfo");
            }}
            buttonText="Back"
            reverse
            containerStyle={Styles.bottomButton}
          />
          <Button
            onPress={() => {
              this.props.navigation.navigate("FacilityDirectory");
            }}
            buttonText="Next"
            containerStyle={Styles.bottomButton}
          />
        </View>
      </View>
    );
  }
}

export default FacilityDirectoryScreen;
