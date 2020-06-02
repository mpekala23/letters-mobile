import React from "react";
import {
  KeyboardAvoidingView,
  Text,
  View,
} from "react-native";
import { Button } from "@components";
import Styles from "./ReferFriends.style";
import { Typography } from "@styles";

class ReferFriendsScreen extends React.Component<Props, State> {
  render() {
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
        		<Text style={[Typography.FONT_BOLD]}> DATE</Text>
        	</Text>
        	<Text style={[Typography.REGULAR, { marginBottom: 36, textAlign: "center" }]}>
        		Your letter to NAME is on the way! Thanks for trusting us to deliver your messages.
        	</Text>
        	<Text style={[Typography.FONT_BOLD, { marginBottom: 24, textAlign: "center" }]}>
        		Do you know anyone that could benefit from Ameelio's free services?
        	</Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between",  }}
          >
  					<Button
  					  buttonText="Skip"
  					  reverse
  					  containerStyle={{ width: 80 }}
  					  textStyle={{fontSize: 16 }}
  					  onPress={() => {
  					    console.log("pressed skip button");
  					  }}
  					/>
  					<Button
  					  buttonText="Share"
  					  containerStyle={{ width: 80 }}
  					  textStyle={{fontSize: 16 }}
  					  onPress={() => {
  					    console.log("pressed share button");
  					  }}
  			    />
  			  </View>
        </View>
      </KeyboardAvoidingView>
  	);
  }
}

export default ReferFriendsScreen;