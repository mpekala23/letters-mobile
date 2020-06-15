import React from "react";
import { View, Text } from "react-native";
import { Button, PrisonCard } from "@components";
import { PrisonTypes } from "types";

const HomeScreen: React.FC = () => {
  return (
    <View>
      <Text>Hello</Text>
      <Button buttonText="Press Me" onPress={() => {}} />
      <View style={{ width: "100%", padding: 10 }}>
        <PrisonCard
          name="Connecticut State Prison"
          type={PrisonTypes.StatePrison}
          address="P.O. Box 400 - CT 99559"
        />
      </View>
    </View>
  );
};

export default HomeScreen;
