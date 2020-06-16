import React from "react";
import { View, Text, TouchableOpacity, Keyboard } from "react-native";
import { Button, Input } from "@components";
import { Validation } from "utils";

const HomeScreen: React.FC = () => {
  return (
    <TouchableOpacity
      activeOpacity={1.0}
      onPress={Keyboard.dismiss}
      style={{ backgroundColor: "white", flex: 1, padding: 10 }}
    >
      <Text>Hello</Text>
      <Button buttonText="Press Me" onPress={() => {}} />
      <Input
        required
        validate={Validation.Email}
        placeholder="placeholder"
        enabled={false}
      />
    </TouchableOpacity>
  );
};

export default HomeScreen;
