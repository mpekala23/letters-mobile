import React from "react";
import { View, Text, ScrollView } from "react-native";
import {
  Button,
  PrisonCard,
  LetterStatusCard,
  MemoryLaneCard,
  LetterOptionCard,
  DeliveryStatusCard,
} from "@components";
import { PrisonTypes } from "types";
import { Colors } from "@styles";

const HomeScreen: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text>Hello</Text>
      <Button buttonText="Press Me" onPress={() => {}} />
      <ScrollView style={{ width: "100%", padding: 10 }}>
        <PrisonCard
          name="Connecticut State Prison"
          type={PrisonTypes.StatePrison}
          address="P.O. Box 400 - CT 99559"
          onPress={() => {}}
        />
        <LetterStatusCard
          status="Out for Delivery"
          date="05/11/2020"
          description="I'm trying out this new service called Ameelio..."
          color={Colors.AMEELIO_RED}
          onPress={() => {}}
        />
        <MemoryLaneCard
          text="How was your day? Did you see the news about ..."
          date="May 15, 2020"
          imageUri="https://reactnativecode.com/wp-content/uploads/2017/05/react_thumb_install.png"
          onPress={() => {}}
          style={{ width: "50%" }}
        />
        <LetterOptionCard
          title="Post cards"
          description="1 photo, 50 words"
          onPress={() => {}}
        />
        <DeliveryStatusCard
          title="Letter 1"
          status="Out for delivery"
          date="05/11/2020"
          progress={1}
          onPress={() => {}}
        />
        <DeliveryStatusCard
          title="Letter 1"
          status="Out for delivery"
          date="05/11/2020"
          progress={2}
          onPress={() => {}}
        />
        <DeliveryStatusCard
          title="Letter 1"
          status="Out for delivery"
          date="05/11/2020"
          progress={3}
          onPress={() => {}}
        />
        <DeliveryStatusCard
          title="Letter 1"
          status="Out for delivery"
          date="05/11/2020"
          progress={4}
          onPress={() => {}}
        />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
