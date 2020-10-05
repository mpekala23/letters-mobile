import React, { createRef, Dispatch } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { Typography } from '@styles';
import { AppStackParamList, Screens } from '@utils/Screens';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Icon, MailingAddressPreview } from '@components';
import Stamp from '@assets/views/Compose/Stamp';
import { POSTCARD_HEIGHT, POSTCARD_WIDTH } from '@utils/Constants';
import { STATES_DROPDOWN, Validation } from '@utils';
import { AppState } from '@store/types';
import store from '@store';
import { ContactActionTypes, ContactState } from '@store/Contact/ContactTypes';
import { ContactDraft, Facility, Image, Contact } from 'types';
import { addContact } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { setAdding, setActive } from '@store/Contact/ContactActions';
import { connect } from 'react-redux';
import i18n from '@i18n';
import { PicUploadTypes } from '@components/PicUpload/PicUpload.react';
import { popupAlert } from '@components/Alert/Alert.react';
import * as Notifs from '@notifications';
import { NotifTypes } from '@store/Notif/NotifTypes';
import * as Segment from 'expo-analytics-segment';
import Styles from './ReviewContact.styles';
import CommonStyles from './AddContact.styles';

type ReviewContactScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ReviewContact'
>;

export interface Props {
  navigation: ReviewContactScreenNavigationProp;
  contactState: ContactState;
  hasSentMail: boolean;
  setAdding: (contactDraft: ContactDraft) => void;
  setActiveContact: (contact: Contact) => void;
  route: { params: { manual: boolean } };
}

export interface State {
  image: Image | null;
}

class ReviewContactScreenBase extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      image: null,
    };
    this.doAddContact = this.doAddContact.bind(this);
  }

  doAddContact = async () => {
    Segment.trackWithProperties('Add Contact - Click on Next', {
      page: 'review',
    });
    const contactDraft: ContactDraft = {
      firstName: this.props.contactState.adding.firstName,
      lastName: this.props.contactState.adding.lastName,
      inmateNumber: this.props.contactState.adding.inmateNumber,
      relationship: this.props.contactState.adding.relationship,
      facility: this.props.contactState.adding.facility,
      image: this.state.image ? this.state.image : undefined,
      unit: this.props.contactState.adding.unit,
      dorm: this.props.contactState.adding.dorm,
    };
    try {
      const { existing } = store.getState().contact;
      // Check if contact being added already exists
      for (let ix = 0; ix < existing.length; ix += 1) {
        if (
          existing[ix].firstName === contactDraft.firstName &&
          existing[ix].lastName === contactDraft.lastName &&
          existing[ix].inmateNumber === contactDraft.inmateNumber &&
          existing[ix].relationship === contactDraft.relationship &&
          existing[ix].facility.name === contactDraft.facility.name &&
          existing[ix].facility.address === contactDraft.facility.address &&
          existing[ix].facility.city === contactDraft.facility.city &&
          existing[ix].facility.postal === contactDraft.facility.postal &&
          existing[ix].facility.state === contactDraft.facility.state &&
          existing[ix].facility.type === contactDraft.facility.type
        ) {
          throw Error('Contact already exists');
        }
      }
      const newContact = await addContact(contactDraft);
      Segment.trackWithProperties('Add Contact - Success', {
        relationship: newContact.relationship,
        facility: newContact.facility.name,
        facilityCity: newContact.facility.city,
        facilityState: newContact.facility.state,
        facilityPostal: newContact.facility.postal,
        facilityType: newContact.facility.type,
        Manual: this.props.route.params.manual,
      });
      Notifs.cancelAllNotificationsByType(NotifTypes.NoFirstContact);
      if (!this.props.hasSentMail) {
        Notifs.scheduleNotificationInDays(
          {
            title: `${i18n.t('Notifs.readyToSend')} ${newContact.firstName}?`,
            body: `${i18n.t('Notifs.clickHereToBegin')}`,
            type: NotifTypes.NoFirstLetter,
            data: {
              contactId: newContact.id,
            },
          },
          1
        );
      }
      this.props.setActiveContact(newContact);
      this.props.navigation.reset({
        index: 0,
        routes: [
          { name: Screens.ContactSelector },
          { name: Screens.SingleContact },
        ],
      });
    } catch (err) {
      if (err.message === 'Invalid inmate number') {
        Segment.trackWithProperties('Add Contact - Error', {
          'Error Type': 'missing inmate ID',
        });
        popupAlert({
          title: i18n.t('ReviewContactScreen.invalidInmateNumber'),
          buttons: [
            {
              text: i18n.t('Alert.okay'),
            },
          ],
        });
      } else if (err.message === 'Contact already exists') {
        Segment.trackWithProperties('Add Contact - Error', {
          'Error Type': 'contact already exists',
        });
        popupAlert({
          title: i18n.t('ReviewContactScreen.contactAlreadyExists'),
          buttons: [
            {
              text: i18n.t('Alert.okay'),
            },
          ],
        });
      } else {
        Segment.trackWithProperties('Add Contact - Error', {
          'Error Type': 'other',
        });
        dropdownError({ message: i18n.t('Error.requestIncomplete') });
      }
    }
  };

  render() {
    return (
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'white' }}
        onPress={() => Keyboard.dismiss()}
        activeOpacity={1.0}
      >
        <View style={Styles.previewBackground}>
          <Icon
            style={{ position: 'absolute', top: 16, right: 16 }}
            svg={Stamp}
          />
          <MailingAddressPreview
            style={{ paddingHorizontal: 8, paddingTop: 24 }}
            recipient={this.props.contactState.adding}
          />
        </View>
        <View style={CommonStyles.bottomButtonContainer}>
          <Button
            blocking
            onPress={this.doAddContact}
            buttonText={i18n.t('ReviewContactScreen.addContact')}
            containerStyle={CommonStyles.bottomButton}
            showNextIcon
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  contactState: state.contact,
  hasSentMail: Object.values(state.mail.existing).some(
    (mail) => mail.length > 0
  ),
});
const mapDispatchToProps = (dispatch: Dispatch<ContactActionTypes>) => {
  return {
    setActiveContact: (contact: Contact) => dispatch(setActive(contact)),
    setAdding: (contactDraft: ContactDraft) =>
      dispatch(setAdding(contactDraft)),
  };
};
const ReviewContactScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewContactScreenBase);

export default ReviewContactScreen;
