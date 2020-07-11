import React, { useCallback } from 'react';
import { Text, ScrollView } from 'react-native';
import { Notif } from '@store/Notif/NotifTypes';
import { useFocusEffect } from '@react-navigation/native';
import { AppState } from '@store/types';
import { connect } from 'react-redux';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, GrayBar } from '@components';
import {
  getContact,
  getContacts,
  getFacilities,
  getFacility,
  addContact,
  updateContact,
  deleteContact,
  getLetters,
  getZipcode,
} from '@api';
import { ContactState } from '@store/Contact/ContactTypes';

type HomeScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Home'>;

interface Props {
  currentNotif: Notif | null;
  contactState: ContactState;
  navigation: HomeScreenNavigationProp;
}

const HomeScreenBase: React.FC<Props> = (props: Props) => {
  // runs when the screen is focused with a new current notification
  useFocusEffect(
    useCallback(() => {
      if (props.currentNotif && props.currentNotif.screen) {
        props.navigation.navigate(props.currentNotif.screen);
      }
    }, [props.currentNotif])
  );

  return (
    <ScrollView style={{ flex: 1 }}>
      <Text>Hello</Text>
      <Button
        buttonText="View Contact List"
        onPress={() => props.navigation.navigate('ContactSelector')}
      />
      <Button
        buttonText="addContact"
        onPress={async () => {
          try {
            const res = await addContact({
              id: -1,
              firstName: 'Test',
              lastName: 'Contact',
              inmateNumber: '6',
              relationship: 'Brother',
              credit: 4,
              facility: {
                name: 'Test facility',
                address: 'Rest ddress',
                city: 'city',
                state: 'CA',
                type: 'Federal Prison',
                postal: '55419',
              },
            });
            console.log('Successed');
            console.log(res);
          } catch (err) {
            console.log('Errored');
            console.log(err);
          }
        }}
      />
      <Button
        buttonText="getContacts"
        onPress={async () => {
          try {
            const res = await getContacts();
            console.log('Successed');
            console.log(res);
            console.log('redux');
            console.log(props.contactState.existing);
          } catch (err) {
            console.log('Errored');
            console.log(err);
          }
        }}
      />
      <Button
        buttonText="getContact"
        onPress={async () => {
          try {
            const res = await getContact(2);
            console.log('Successed');
            console.log(res);
          } catch (err) {
            console.log('Errored');
            console.log(err);
          }
        }}
      />
      <Button
        buttonText="updateContact"
        onPress={async () => {
          try {
            const res = await updateContact({
              id: 2,
              firstName: 'Update Test',
              lastName: 'Contact',
              inmateNumber: '6',
              relationship: 'Brother',
              credit: 4,
              facility: {
                name: 'Test facility',
                address: 'Rest ddress',
                city: 'city',
                state: 'CA',
                type: 'Federal Prison',
                postal: '55419',
              },
            });
            console.log('Successed');
            console.log(res);
          } catch (err) {
            console.log('Errored');
            console.log(err);
          }
        }}
      />
      <Button
        buttonText="deleteContact"
        onPress={async () => {
          try {
            const res = await deleteContact(2);
            console.log('Successed');
            console.log(res);
          } catch (err) {
            console.log('Errored');
            console.log(err);
          }
        }}
      />
      <Button
        buttonText="getFacilities"
        onPress={async () => {
          try {
            const res = await getFacilities();
            console.log('Successed');
            console.log(res);
          } catch (err) {
            console.log('Errored');
            console.log(err);
          }
        }}
      />
      <Button
        buttonText="getFacility"
        onPress={async () => {
          try {
            const res = await getFacility(0);
            console.log('Successed');
            console.log(res);
          } catch (err) {
            console.log('Errored');
            console.log(err);
          }
        }}
      />
      <Button
        buttonText="getLetters"
        onPress={async () => {
          try {
            const res = await getLetters();
            console.log('Successed');
            console.log(res);
          } catch (err) {
            console.log('Errored');
            console.log(err);
          }
        }}
      />
      <Button
        buttonText="getZipcode"
        onPress={async () => {
          try {
            const res = await getZipcode('90210');
            console.log('Successed');
            console.log(res);
          } catch (err) {
            console.log('Errored');
            console.log(err);
          }
        }}
      />
      <GrayBar />
      <Button
        buttonText="Add Button"
        onPress={() => props.navigation.navigate('ContactInfo')}
      />
      <Button
        buttonText="Selector Button"
        onPress={() => props.navigation.navigate('ContactSelector')}
      />
    </ScrollView>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    currentNotif: state.notif.currentNotif,
    contactState: state.contact,
  };
};

const HomeScreen = connect(mapStateToProps)(HomeScreenBase);

export default HomeScreen;
