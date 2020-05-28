import React, { createRef } from "react";
import { ScrollView, Text, View } from "react-native";
import { Button, Input } from "@components";
import Styles from "./Register.style";
import { Typography } from "@styles";

class RegisterScreen extends React.Component<{}, {}> {
  constructor(props) {
    super(props);
    this.firstName = createRef();
    this.lastName = createRef();
    this.cell = createRef();
    this.address1 = createRef();
    this.address2 = createRef();
    this.country = createRef();
    this.zipcode = createRef();
    this.city = createRef();
  }

  render() {
    return (
      <View style={Styles.trueBackground}>
        <ScrollView style={Styles.backgroundScroll}>
          <View style={Styles.privacyBackground}>
            <Text style={[Typography.FONT_BOLD, Styles.privacyText]}>
              We value your privacy. We will only use your address information
              as the return address for the mailed letter.
            </Text>
          </View>
          <Input
            ref={this.firstName}
            parentStyle={Styles.fullWidth}
            placeholder={"First Name"}
          />
          <Input
            ref={this.lastName}
            parentStyle={Styles.fullWidth}
            placeholder={"Last Name"}
          />
          <Input
            ref={this.cell}
            parentStyle={Styles.fullWidth}
            placeholder={"Cell Phone Number"}
          />
          <Input
            ref={this.address1}
            parentStyle={Styles.fullWidth}
            placeholder={"Address Line 1"}
          />
          <Input
            ref={this.address2}
            parentStyle={Styles.fullWidth}
            placeholder={"Address Line 2"}
          />
          <Input
            ref={this.country}
            parentStyle={Styles.fullWidth}
            placeholder={"Country"}
          />
          <Input
            ref={this.zipcode}
            parentStyle={Styles.fullWidth}
            placeholder={"Zip Code"}
          />
          <Input
            ref={this.city}
            parentStyle={Styles.fullWidth}
            placeholder={"City"}
          />
        </ScrollView>
      </View>
    );
  }
}

export default RegisterScreen;
