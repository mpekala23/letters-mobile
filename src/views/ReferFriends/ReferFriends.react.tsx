import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Text,
  View,
} from "react-native";
import { Button } from "@components";
import { facebookShare } from "@api";
import { getDropdownRef } from "@components/Dropdown/Dropdown.react";
import DropdownAlert from "react-native-dropdownalert";
import Styles from "./ReferFriends.style";
import { Typography } from "@styles";

export interface Props {
  userName: string,
  deliveryDate: string,
}

/**
A component for prompting users to refer friends to use Ameelio's services.
*/
const ReferFriendsScreen: React.FC<Props> = (props) => {
  const {
    userName,
    deliveryDate,
  } = props;

  var dropdownRef = React.useRef(DropdownAlert);
  dropdownRef = getDropdownRef();

  return (
    <KeyboardAvoidingView
      style={Styles.trueBackground}
      behavior="padding"
      enabled
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        {/* TO-DO: Add in image asset when finalized */}
        <Text style={[Typography.REGULAR, { marginBottom: 24, textAlign: "center" }]}>
          Estimated delivery date:
      		<Text style={[Typography.FONT_BOLD]}> {deliveryDate}</Text>
        </Text>
        <Text style={[Typography.REGULAR, { marginBottom: 36, textAlign: "center" }]}>
          Your letter to {userName} is on the way! Thanks for trusting us to deliver your messages.
      	</Text>
        <Text style={[Typography.FONT_BOLD, { marginBottom: 24, textAlign: "center" }]}>
          Do you know anyone that could benefit from Ameelio's free services?
      	</Text>
        <View
          style={{ flexDirection: "row", justifyContent: "space-between", }}
        >
          <Button
            buttonText="Skip"
            reverse
            containerStyle={{ width: 80 }}
            textStyle={{ fontSize: 16 }}
            onPress={() => props.navigation.navigate("Home")}
          />
          <Button
            buttonText="Share"
            containerStyle={{ width: 80 }}
            textStyle={{ fontSize: 16 }}
            onPress={() => onShare(dropdownRef)}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const onShare = async (dropdownRef: Ref) => {
  const ameelioUrl = "letters.ameelio.org";
  // TO-DO: Edit message content once we have the content copy
  const shareMessage = "Insert share message";
  const sharingUrl = "https://www.facebook.com/sharer/sharer.php?u=" + ameelioUrl + "&quote=" + shareMessage;
  try {
    await facebookShare(sharingUrl)
  } catch (err) {
    if (dropdownRef.current) {
      dropdownRef.current.alertWithType(
        "error",
        "Network Error",
        "The request could not be completed."
      );
    }
  }
}

export default ReferFriendsScreen;
