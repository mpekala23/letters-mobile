import React from "react";
import { View, FlatList, Text, TouchableOpacity, Keyboard } from "react-native";
import { Colors, Typography } from "@styles";
import { AppStackParamList } from "navigations";
import { StackNavigationProp } from "@react-navigation/stack";
import Styles from "./FacilityDirectory.styles";
import CommonStyles from "./AddContact.styles";
import { Button, Input } from "@components";
import { Facility } from "types";

type ContactInfoScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  "FacilityDirectory"
>;

export interface Props {
  navigation: ContactInfoScreenNavigationProp;
}

export interface State {
  selected: Facility | null;
}

const example: Facility = {
  name: "Yukon Kskokwim Correctional Center",
  type: "State Prison",
  address: "P.O. Box 400",
  city: "Bethel",
  state: "AK",
  postal: "99559",
};

class FacilityDirectoryScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selected: null,
    };
    this.renderItem = this.renderItem.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
  }

  renderItem({ item }) {
    return (
      <TouchableOpacity
        style={[
          Styles.shadow,
          Styles.itemBackground,
          this.state.selected === item ? Styles.selectedBackground : {},
        ]}
        onPress={() => {
          if (this.state.selected === item) {
            this.setState({ selected: null });
          } else {
            this.setState({ selected: item });
          }
        }}
      >
        <Text style={[Typography.FONT_BOLD, Styles.itemTitle]}>
          {item.name}
        </Text>
        <Text style={[Typography.FONT_ITALIC, Styles.itemInfo]}>
          {item.type}
        </Text>
        <Text style={[Typography.FONT_ITALIC, Styles.itemInfo]}>
          {item.address} - {item.city}, {item.state} {item.postal}
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
        <Button
          buttonText="Add Manually"
          onPress={() => {
            this.props.navigation.navigate("AddManually");
          }}
        />
      </View>
    );
  }

  render() {
    return (
      <TouchableOpacity
        style={Styles.facilityBackground}
        onPress={Keyboard.dismiss}
        activeOpacity={1.0}
      >
        <Typography.PageHeader text="Facility Directory" />
        <Input
          parentStyle={Styles.searchParent}
          inputStyle={Styles.searchInput}
          onChangeText={(val: string) => {
            console.log(val);
          }}
        />
        <FlatList
          data={[example]}
          renderItem={this.renderItem}
          contentContainerStyle={Styles.flatBackground}
          ListFooterComponent={this.renderFooter}
          keyExtractor={(item) => item.name}
        />
        <View style={CommonStyles.bottomButtonContainer}>
          <Button
            onPress={() => {
              this.props.navigation.navigate("ContactInfo");
            }}
            buttonText="Back"
            reverse
            containerStyle={CommonStyles.bottomButton}
          />
          <Button
            onPress={() => {
              this.props.navigation.navigate("ReviewContact");
            }}
            buttonText="Next"
            enabled={this.state.selected !== null}
            containerStyle={CommonStyles.bottomButton}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

export default FacilityDirectoryScreen;
