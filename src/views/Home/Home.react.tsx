import React, { useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Button, ProfilePic} from "@components";
import { Notif, NotifType } from "@store/Notif/NotifTypes";
import { useFocusEffect } from "@react-navigation/native";
import { AppState } from "store/types";
import { connect } from "react-redux";
import { RootStackParamList, AppStackParamList } from "navigations";
import { StackNavigationProp } from "@react-navigation/stack";
import Notifs from "@notifications";
import { Colors, Typography } from "@styles";
import Styles from "./Home.styles";

type HomeScreenNavigationProp = StackNavigationProp<AppStackParamList, "Home">;

interface Props {
  currentNotif: Notif | null;
  navigation: HomeScreenNavigationProp;
}

const HomeScreenBase: React.FC<Props> = (props) => {
  // runs only on the first render
  // useEffect(() => {
  //   async function doSetup() {
  //     await Notifs.setup();
  //   }
  //   doSetup();
  // }, []);

  // runs when the screen is focused with a new current notification
  // useFocusEffect(
  //   useCallback(() => {
  //     if (props.currentNotif && props.currentNotif.screen) {
  //       props.navigation.navigate(props.currentNotif.screen);
  //     }
  //   }, [props.currentNotif])
  // );

  return (
    <View style={Styles.background}>
      <View style={Styles.profile}>
        <View style={Styles.profileHeader}></View>
        {/*<ProfilePic />*/}
        <Text
          style={[
            Typography.FONT_BOLD,
            { margin: 8, fontSize: 25 },
          ]}
        >
          Emily Smith
        </Text>
        <Text
          style={[
            Typography.FONT_REGULAR,
            { 
              marginBottom: 4, 
              fontSize: 16, 
              color: Colors.AMEELIO_BLACK },
          ]}
        >
          Last heard from:
        </Text>
        <Text
          style={[
            Typography.FONT_REGULAR,
            { 
              marginBottom: 4, 
              fontSize: 16, 
              color: Colors.AMEELIO_BLACK },
          ]}
        >
          Letter mileage:
        </Text>
        <Button
          buttonText={"Send Letter"}
          onPress={() => console.log("pressed send letter")}
          containerStyle={{ 
            width: "100%", 
            marginTop: 12, 
            padding: 4, 
            backgroundColor: "#FC7272",
            borderRadius: 15,
            height: 50, 
          }}
          textStyle={{ fontSize: 20 }}
        />
      </View>
      <ScrollView>
        <TouchableOpacity 
          style={Styles.memoryLane} 
          onPress={() => console.log("show memory lane screen")}
        >
          <Text
            style={[
              Typography.FONT_BOLD,
              { 
                marginLeft: 16, 
                marginTop: 12,
                fontSize: 22, 
                color: Colors.AMEELIO_BLACK },
            ]}
          >
            Memory Lane
          </Text>
          <Text
            style={[
              Typography.FONT_REGULAR,
              {
                marginLeft: 16, 
                marginTop: 7,
                fontSize: 16, 
                color: Colors.GRAY_DARK },
            ]}
          >
            Send letter to loved one
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            Typography.FONT_BOLD,
            { 
              marginLeft: 16,
              marginTop: 8, 
              marginBottom: 16,
              fontSize: 20, 
              color: Colors.GRAY_DARKER },
          ]}
        >
          LETTER TRACKING
        </Text>
        <TouchableOpacity 
          style={Styles.letter} 
          onPress={() => console.log("show letter tracking scren")}
        >
          <View style={[{ flexDirection: "row", marginTop: 16 }]}>
            <Text
              style={[
                Typography.FONT_BOLD,
                { 
                  marginLeft: 16, 
                  fontSize: 22, 
                  color: Colors.AMEELIO_BLACK },
              ]}
            >
              Letter 1
            </Text>
            <Text
              style={[
                Typography.FONT_REGULAR,
                { 
                  position: "absolute",
                  fontSize: 16, 
                  right: 24,
                  color: Colors.GRAY_DARK },
              ]}
            >
              05/11/2020
            </Text>
          </View>
          <Text
            style={[
              Typography.FONT_REGULAR,
              { 
                marginLeft: 16, 
                marginTop: 6,
                fontSize: 16, 
                color: Colors.GRAY_DARK },
            ]}
          >
            Out for delivery
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = function (state: AppState) {
  return {
    currentNotif: state.notif.currentNotif,
  };
};

const HomeScreen = connect(mapStateToProps)(HomeScreenBase);

export default HomeScreen;
