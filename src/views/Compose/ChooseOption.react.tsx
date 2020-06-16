import React from "react";
import { Text, View } from "react-native";
import { LetterOptionCard } from "@components";

const ChooseOptionScreen: React.FC = () => {
  return (
    <View>
      <Text>Choose an option</Text>
      <LetterOptionCard title="Post cards"></LetterOptionCard>
    </View>
  );
};
