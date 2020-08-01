import React, { Dispatch } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from 'react-native';
import { Button, ProfilePic } from '@components';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Contact, ContactActionTypes } from '@store/Contact/ContactTypes';
import { Colors, Typography } from '@styles';
import { ProfilePicTypes, Letter } from 'types';
import CreditsCard from '@components/Card/CreditsCard.react';
import LetterStatusCard from '@components/Card/LetterStatusCard.react';
import MemoryLaneCountCard from '@components/Card/MemoryLaneCountCard.react';
import i18n from '@i18n';
import {
  setActive as setActiveLetter,
  setComposing,
} from '@store/Letter/LetterActions';
import { LetterActionTypes } from '@store/Letter/LetterTypes';
import PencilIcon from '@assets/components/Card/Pencil';
import Icon from '@components/Icon/Icon.react';
import { connect } from 'react-redux';
import { setActive as setActiveContact } from '@store/Contact/ContactActions';
import { LinearGradient } from 'expo-linear-gradient';
import { getLetters, getContact, getUser, getZipcode } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { UserState } from '@store/User/UserTypes';
import { AppState } from '@store/types';
import { Notif, NotifActionTypes } from '@store/Notif/NotifTypes';
import { handleNotif } from '@store/Notif/NotifiActions';
import * as Segment from 'expo-analytics-segment';
import { haversine } from '@utils';
import { differenceInBusinessDays } from 'date-fns';
import Styles from './SingleContact.styles';

type SingleContactScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'SingleContact'
>;

interface State {
  refreshing: boolean;
}

interface Props {
  navigation: SingleContactScreenNavigationProp;
  activeContact: Contact;
  existingLetters: Letter[];
  userState: UserState;
  setActiveLetter: (letter: Letter) => void;
  setComposing: (letter: Letter) => void;
  setActiveContact: (contact: Contact) => void;
  currentNotif: Notif | null;
  handleNotif: () => void;
  composing: Letter;
}

class SingleContactScreenBase extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  async componentDidMount() {
    if (this.props.currentNotif) this.props.handleNotif();
  }

  render() {
    const contact = this.props.activeContact;
    const letters = this.props.existingLetters;
    const letterCards =
      letters && letters.length > 0
        ? letters.map((letter: Letter) => {
            if (letter.trackingEvents) {
              let processedForDelivery = false;
              let processedForDeliveryDate = new Date();
              for (let ix = 0; ix < letter.trackingEvents.length; ix += 1) {
                processedForDelivery =
                  processedForDelivery ||
                  letter.trackingEvents[ix].name === 'Processed for Delivery';
                if (
                  letter.trackingEvents[ix].name === 'Processed for Delivery'
                ) {
                  processedForDeliveryDate = letter.trackingEvents[ix].date;
                }
              }
              if (
                !processedForDelivery ||
                differenceInBusinessDays(
                  processedForDeliveryDate,
                  new Date()
                ) <= 5
              ) {
                return (
                  <LetterStatusCard
                    status={letter.status}
                    date={letter.dateCreated}
                    description={letter.content}
                    onPress={() => {
                      Segment.track('Contact View - Click on Letter Tracking');
                      this.props.setActiveLetter(letter);
                      this.props.navigation.navigate('LetterTracking');
                    }}
                    key={letter.letterId}
                  />
                );
              }
              return null;
            }
            if (
              differenceInBusinessDays(
                letter.dateCreated ? letter.dateCreated : new Date(),
                new Date()
              ) <= 11
            )
              return (
                <LetterStatusCard
                  status={letter.status}
                  date={letter.dateCreated}
                  description={letter.content}
                  onPress={() => {
                    Segment.track('Contact View - Click on Letter Tracking');
                    this.props.setActiveLetter(letter);
                    this.props.navigation.navigate('LetterTracking');
                  }}
                  key={letter.letterId}
                />
              );
            return null;
          })
        : null;

    const letterTrackingTitle =
      letters && letters.length > 0 ? (
        <Text
          style={[
            Typography.BASE_TITLE,
            {
              color: Colors.GRAY_DARK,
              paddingTop: 12,
            },
          ]}
        >
          {i18n.t('SingleContactScreen.letterTracking')}
        </Text>
      ) : null;

    const refresh = (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={async () => {
          this.setState({ refreshing: true });
          try {
            await getLetters();
            await getContact(this.props.activeContact.id);
            await getUser();
          } catch (err) {
            dropdownError({ message: i18n.t('Error.cantRefreshLetters') });
          }
          this.setState({ refreshing: false });
        }}
      />
    );

    return (
      <View style={Styles.trueBackground}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          refreshControl={refresh}
        >
          <View style={Styles.profileCard}>
            <LinearGradient
              colors={['#ADD3FF', '#FFC9C9']}
              style={Styles.profileCardHeader}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
            >
              <TouchableOpacity
                onPress={() => {
                  Segment.track('Contact View - Click on Edit Contact');
                  this.props.navigation.navigate('UpdateContact');
                }}
                style={{
                  width: 50,
                  height: 50,
                  position: 'absolute',
                  right: 0,
                }}
              >
                <Icon
                  svg={PencilIcon}
                  style={{ position: 'absolute', top: 8, right: 12 }}
                />
              </TouchableOpacity>
            </LinearGradient>
            <ProfilePic
              firstName={contact.firstName}
              lastName={contact.lastName}
              imageUri={contact.photo?.uri}
              type={ProfilePicTypes.SingleContact}
            />
            <Text
              style={[
                Typography.FONT_BOLD,
                {
                  color: Colors.AMEELIO_BLACK,
                  fontSize: 25,
                },
              ]}
            >
              {contact.firstName} {contact.lastName}
            </Text>
            {contact.facility && (
              <View style={{ alignItems: 'center' }}>
                <Text style={[Typography.FONT_REGULAR, Styles.profileCardInfo]}>
                  {contact.facility.name}
                </Text>

                <Text
                  style={[
                    Typography.FONT_REGULAR,
                    Styles.profileCardInfo,
                    { paddingBottom: 8 },
                  ]}
                >
                  {contact.facility.address}
                </Text>
              </View>
            )}
            <Button
              onPress={() => {
                this.props.navigation.navigate('ChooseOption');
                Segment.trackWithProperties(
                  'Contact View - Click on Send Letter',
                  {
                    Type:
                      this.props.composing.content !== '' ||
                      this.props.composing.photo
                        ? 'draft'
                        : 'blank',
                  }
                );
              }}
              buttonText={i18n.t('SingleContactScreen.sendLetter')}
              textStyle={(Typography.FONT_BOLD, { fontSize: 20 })}
              containerStyle={Styles.sendLetterButton}
              enabled={this.props.userState.user.credit > 0}
            />
          </View>
          <View style={Styles.actionItems}>
            <CreditsCard
              credits={this.props.userState.user.credit}
              onPress={() => {
                Linking.openURL(
                  "mailto:outreach@ameelio.org?subject=I'd%20like%20to%20send%20more%20letters%20a%20weekly&body=Hi%20Team%20Ameelio%2C%20can%20you%20please%20let%20me%20know%20how%20I%20can%20increase%20my%20weekly%20letter%20limit%3F"
                );
              }}
            />
            <MemoryLaneCountCard
              letterCount={letters ? letters.length : 0}
              onPress={() => {
                this.props.setActiveContact(contact);
                this.props.navigation.navigate('MemoryLane');
              }}
              style={{ height: 100 }}
            >
              <Icon
                svg={PencilIcon}
                style={{ position: 'absolute', top: 8, right: 12 }}
              />
            </MemoryLaneCountCard>
            {letterTrackingTitle}
            {letterCards}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  activeContact: state.contact.active,
  existingLetters: state.letter.existing[state.contact.active.id],
  userState: state.user,
  currentNotif: state.notif.currentNotif,
  composing: state.letter.composing,
});
const mapDispatchToProps = (
  dispatch: Dispatch<LetterActionTypes | ContactActionTypes | NotifActionTypes>
) => ({
  setActiveContact: (contact: Contact) => dispatch(setActiveContact(contact)),
  setActiveLetter: (letter: Letter) => dispatch(setActiveLetter(letter)),
  setComposing: (letter: Letter) => dispatch(setComposing(letter)),
  handleNotif: () => dispatch(handleNotif()),
});
const SingleContactScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleContactScreenBase);

export default SingleContactScreen;
