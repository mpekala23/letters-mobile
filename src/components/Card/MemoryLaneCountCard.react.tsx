import React from "react";
import {
  Text,
  TouchableOpacity,
  ViewStyle,
  InteractionManagerStatic,
} from "react-native";
import CardStyles from "./Card.styles";
import { Colors } from "@styles";
import LettersFilledIcon from "assets/components/Card/LettersFilled";
import Icon from "../Icon/Icon.react";

interface Props {
  letterCount: number;
  onPress: () => void;
  style?: ViewStyle;
}

const MemoryLaneCardCount: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity
      style={[
        CardStyles.cardBase,
        CardStyles.letterOptionsBackground,
        CardStyles.shadow,
        props.style,
      ]}
      onPress={props.onPress}
    >
      <Icon
        svg={LettersFilledIcon}
        style={{ position: "absolute", right: 0, bottom: 0 }}
      />
      <Text style={CardStyles.cardData}>Memory Lane</Text>
      <Text
        style={
          props.letterCount === 0
            ? {
                fontSize: 16,
                fontWeight: "bold",
                color: Colors.AMEELIO_BLACK,
                width: "65%",
                paddingTop: 8,
              }
            : CardStyles.cardTitle
        }
      >
        {props.letterCount === 0
          ? "You have no past letters! Go send your first letter."
          : props.letterCount === 1
          ? "1 Letter"
          : `${props.letterCount} Letters`}
      </Text>
    </TouchableOpacity>
  );
};

export default MemoryLaneCardCount;
