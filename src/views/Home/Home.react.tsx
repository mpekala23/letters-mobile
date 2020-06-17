import React, { useCallback, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { Notif } from "@store/Notif/NotifTypes";
import { useFocusEffect } from "@react-navigation/native";
import { AppState } from "store/types";
import { connect } from "react-redux";
import { AppStackParamList } from "navigations";
import { StackNavigationProp } from "@react-navigation/stack";
import Notifs from "@notifications";
import { Colors } from "@styles";
import { Button } from "@components";
import PrisonCard from "@components/Card/PrisonCard.react";
import LetterStatusCard from "@components/Card/LetterStatusCard.react";
import MemoryLaneCard from "@components/Card/MemoryLaneCard.react";
import LetterOptionCard, {
  LetterTypes,
} from "@components/Card/LetterOptionCard.react";
import DeliveryStatusCard from "@components/Card/DeliveryStatusCard.react";
import { PrisonTypes, DeliveryProgress } from "types";

type HomeScreenNavigationProp = StackNavigationProp<AppStackParamList, "Home">;

interface Props {
  currentNotif: Notif | null;
  navigation: HomeScreenNavigationProp;
}

const HomeScreenBase: React.FC<Props> = (props) => {
  // runs only on the first render
  useEffect(() => {
    async function doSetup() {
      await Notifs.setup();
    }
    doSetup();
  }, []);

  // runs when the screen is focused with a new current notification
  useFocusEffect(
    useCallback(() => {
      if (props.currentNotif && props.currentNotif.screen) {
        props.navigation.navigate(props.currentNotif.screen);
      }
    }, [props.currentNotif])
  );

  return (
    <View style={{ flex: 1 }}>
      <Text>Hello</Text>
      <Button buttonText="Press Me" onPress={() => {props.navigation.navigate("ContactInfo")}} />
      <ScrollView style={{ width: "100%", padding: 10 }}>
        <PrisonCard
          name="Connecticut State Prison"
          type={PrisonTypes.State}
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
        <LetterOptionCard type={LetterTypes.PostCards} onPress={() => {}} />
        <LetterOptionCard type={LetterTypes.Letters} onPress={() => {}} />
        <DeliveryStatusCard
          title="Letter 1"
          status="Out for delivery"
          date="05/11/2020"
          progress={DeliveryProgress.Created}
          onPress={() => {}}
        />
        <DeliveryStatusCard
          title="Letter 1"
          status="Out for delivery"
          date="05/11/2020"
          progress={DeliveryProgress.Printed}
          onPress={() => {}}
        />
        <DeliveryStatusCard
          title="Letter 1"
          status="Out for delivery"
          date="05/11/2020"
          progress={DeliveryProgress.Mailed}
          onPress={() => {}}
        />
        <DeliveryStatusCard
          title="Letter 1"
          status="Out for delivery"
          date="05/11/2020"
          progress={DeliveryProgress.OutForDelivery}
          onPress={() => {}}
        />
        <DeliveryStatusCard
          title="Letter 1"
          status="Out for delivery"
          date="05/11/2020"
          progress={DeliveryProgress.Delivered}
          onPress={() => {}}
        />
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
