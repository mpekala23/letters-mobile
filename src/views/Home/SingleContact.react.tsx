import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Button, ProfilePic } from '@components';
import { AppStackParamList } from 'navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { ContactState, Contact, ContactActionTypes } from '@store/Contact/ContactTypes';
import { Colors, Typography } from '@styles';
import Styles from './SingleContact.styles';

type SingleContactScreenNavigationProp = StackNavigationProp<AppStackParamList, 'SingleContact'>;

export interface Props {
  navigation: ContactInfoScreenNavigationProp;
  route: {
    params: { contact: Contact };
  };
}

class SingleContactScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { contact } = this.props.route.params;
    return (
      <View style={Styles.trueBackground}>
        <View style={Styles.profileCard}>
          <ProfilePic
            firstName={contact.firstName}
            lastName={contact.lastName}
            displaySingleContact
            imageUri="ExamplePic"
          />
          <Text
            style={[
              Typography.FONT_BOLD,
              {
                color: Colors.AMEELIO_BLACK,
                fontSize: 25,
                padding: 12,
              },
            ]}
          >
            {contact.firstName} {contact.lastName}
          </Text>
          <Text style={[Typography.FONT_REGULAR, Styles.profileCardInfo]}>
            💌 received: 5 letters
          </Text>
          <Text style={[Typography.FONT_REGULAR, Styles.profileCardInfo]}>
            📅 last heard from you: June 12
          </Text>
          <Text style={[Typography.FONT_REGULAR, Styles.profileCardInfo, { paddingBottom: 16 }]}>
            ✈️ letters traveled: 3,598 miles
          </Text>
          <Button
            onPress={() => {}}
            buttonText="Send letter"
            textStyle={{ fontSize: 20 }}
            containerStyle={Styles.sendLetterButton}
          />
        </View>
        <ScrollView style={Styles.actionItems} keyboardShouldPersistTaps="handled">
          <Text
            style={[
              Typography.FONT_BOLD,
              {
                color: Colors.GRAY_DARKER,
                fontSize: 20,
                paddingBottom: 16,
              },
            ]}
          >
            LETTER TRACKING
          </Text>
          <TouchableOpacity style={Styles.itemCard} onPress={() => {}}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text
                style={[
                  Typography.FONT_BOLD,
                  {
                    color: '#383838',
                    fontSize: 22,
                    paddingBottom: 4,
                  },
                ]}
              >
                Letter 1
              </Text>
              <Text
                style={[
                  Typography.FONT_REGULAR,
                  {
                    color: Colors.GRAY_DARK,
                    padding: 4,
                    paddingRight: 16,
                    fontSize: 16,
                    marginLeft: 'auto',
                  },
                ]}
              >
                05/11/2020
              </Text>
            </View>
            <Text
              style={[
                Typography.FONT_REGULAR,
                {
                  color: Colors.GRAY_DARK,
                  fontSize: 16,
                  paddingBottom: 16,
                },
              ]}
            >
              Out for delivery
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

export default SingleContactScreen;
