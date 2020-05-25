import { StyleSheet } from "react-native";
import { Colors } from "@styles";
import { AMEELIO_BLACK } from "styles/Colors";

const inputHeight = 50;

export default StyleSheet.create({
  parentStyle: {
    height: inputHeight,
    marginVertical: 5,
  },
  scrollStyle: {},
  inputStyle: {
    flex: 1,
    height: inputHeight,
    borderWidth: 2,
    borderRadius: 4,
    padding: 10,
    fontSize: 18,
    color: Colors.AMEELIO_BLACK,
  },
});
