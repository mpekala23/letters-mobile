import React from "react";
import { View, Text } from "react-native";
import { Button } from "@components";

const HomeScreen: React.FC = () => {
  return (
    <View>
      <Text>Hello</Text>
      <Button buttonText="Press Me" onPress={() => {}} />
    </View>
  );
};

export default HomeScreen;
