import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Button, ProfilePic } from "@components";
import { AppStackParamList } from "navigations";
import { StackNavigationProp } from "@react-navigation/stack";
import { Contact } from "@store/Contact/ContactTypes";
import { Colors, Typography } from "@styles";
import Styles from "./SingleContact.styles";
import { ProfilePicTypes } from "types";
import LetterStatusCard from "@components/Card/LetterStatusCard.react";
import MemoryLaneCountCard from "components/Card/MemoryLaneCountCard.react";

type SingleContactScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  "SingleContact"
>;

interface Props {
  navigation: SingleContactScreenNavigationProp;
  route: {
    params: { contact: Contact };
  };
}

const SingleContactScreen: React.FC<Props> = (props) => {
  const { contact } = props.route.params;
  return (
    <View style={Styles.trueBackground}>
      <View style={Styles.profileCard}>
        <View style={Styles.profileCardHeader}></View>
        <ProfilePic
          firstName={contact.firstName}
          lastName={contact.lastName}
          imageUri="ExamplePic"
          type={ProfilePicTypes.SingleContact}
        />
        <Text
          style={[
            Typography.FONT_BOLD,
            {
              color: Colors.AMEELIO_BLACK,
              fontSize: 25,
              paddingBottom: 4,
            },
          ]}
        >
          {contact.firstName} {contact.lastName}
        </Text>
        <Text style={[Typography.FONT_REGULAR, Styles.profileCardInfo]}>
          💌 received:
        </Text>
        <Text style={[Typography.FONT_REGULAR, Styles.profileCardInfo]}>
          📅 last heard from you:
        </Text>
        <Text
          style={[
            Typography.FONT_REGULAR,
            Styles.profileCardInfo,
            { paddingBottom: 4 },
          ]}
        >
          ✈️ letters traveled:
        </Text>
        <Button
          onPress={() => {}}
          buttonText="Send letter"
          textStyle={{ fontSize: 20 }}
          containerStyle={Styles.sendLetterButton}
        />
      </View>
      <ScrollView
        style={Styles.actionItems}
        keyboardShouldPersistTaps="handled"
      >
        <MemoryLaneCountCard letterCount={5} onPress={() => {}} />
        <Text
          style={[
            Typography.FONT_BOLD,
            {
              color: Colors.GRAY_DARKER,
              fontSize: 20,
              paddingTop: 24,
              paddingBottom: 16,
            },
          ]}
        >
          Letter Tracking
        </Text>
        <LetterStatusCard
          status="Out for Delivery"
          date="05/11/2020"
          description="I'm trying out this new service called Ameelio..."
          color={Colors.AMEELIO_RED}
          onPress={() => {}}
        />
      </ScrollView>
    </View>
  );
};

export default SingleContactScreen;
