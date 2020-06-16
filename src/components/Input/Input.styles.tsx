import { StyleSheet } from "react-native";
import { Colors } from "@styles";
import { AMEELIO_BLACK } from "styles/Colors";

export const INPUT_HEIGHT = 50;
export const DROP_HEIGHT = 250;
export const OPTION_HEIGHT = 50;
export const NUM_OPTIONS = 4;
export const VERTICAL_MARGIN = 5;

export default StyleSheet.create({
  parentStyle: {
    width: "100%",
    marginBottom: VERTICAL_MARGIN * 2,
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    overflow: "hidden",
  },
  scrollStyle: {
    flex: 1,
    width: "100%",
  },
  baseInputStyle: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0)",
    padding: 10,
    fontSize: 16,
    color: "#9A9A9A",
  },
  inputStyleFocused: {
    color: Colors.AMEELIO_BLACK,
  },
  validStyle: {
    backgroundColor: "#F0FAF3",
    borderColor: "#9EE2B8",
    color: "black",
  },
  invalidStyle: {
    color: "#9A9A9A",
    borderColor: "#FF9E9E",
    backgroundColor: "#FFF5F5",
  },
  disabledInputStyle: {
    opacity: 0.7,
    color: "#9A9A9A",
  },
  optionBackground: {
    width: "100%",
    zIndex: 5,
  },
  optionScroll: {
    width: "100%",
    flex: 1,
  },
  optionContainer: {
    width: "100%",
    height: OPTION_HEIGHT,
    justifyContent: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.AMEELIO_BLACK,
  },
  optionText: {},
  secureButtonsContainer: {
    position: "absolute",
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    width: 80,
    paddingHorizontal: 10,
  },
});
