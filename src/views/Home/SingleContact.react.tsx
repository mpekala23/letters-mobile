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
import { AppStackParamList, Screens } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { ContactActionTypes } from '@store/Contact/ContactTypes';
import { Colors, Typography } from '@styles';
import {
  ProfilePicTypes,
  Mail,
  MailStatus,
  MailTypes,
  Draft,
  Contact,
  TrackingEvent,
} from 'types';
import CreditsCard from '@components/Card/CreditsCard.react';
import LetterStatusCard from '@components/Card/LetterStatusCard.react';
import MemoryLaneCountCard from '@components/Card/MemoryLaneCountCard.react';
import i18n from '@i18n';
import {
  setActive as setActiveLetter,
  setComposing,
} from '@store/Mail/MailActions';
import { MailActionTypes } from '@store/Mail/MailTypes';
import PencilIcon from '@assets/components/Card/Pencil';
import Icon from '@components/Icon/Icon.react';
import { connect } from 'react-redux';
import { setActive as setActiveContact } from '@store/Contact/ContactActions';
import { LinearGradient } from 'expo-linear-gradient';
import {
  getMail,
  getContact,
  getUser,
  getTrackingEvents,
  getCategories,
} from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { UserState } from '@store/User/UserTypes';
import { AppState } from '@store/types';
import { Notif, NotifActionTypes } from '@store/Notif/NotifTypes';
import { handleNotif } from '@store/Notif/NotifiActions';
import * as Segment from 'expo-analytics-segment';
import { differenceInBusinessDays } from 'date-fns';
import { popupAlert } from '@components/Alert/Alert.react';
import { deleteDraft } from '@api/User';
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
  existingMail: Mail[];
  existingContacts: Contact[];
  userState: UserState;
  setActiveLetter: (mail: Mail) => void;
  setComposing: (draft: Draft) => void;
  setActiveContact: (contact: Contact) => void;
  currentNotif: Notif | null;
  handleNotif: () => void;
  composing: Draft;
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
    const mail = this.props.existingMail;
    const letterCards =
      mail && mail.length > 0
        ? mail.map((item: Mail) => {
            if (item.trackingEvents) {
              let processedForDelivery = false;
              let processedForDeliveryDate = new Date();
              const processedEvent = item.trackingEvents.find(
                (event: TrackingEvent) =>
                  event.name === MailStatus.ProcessedForDelivery
              );
              processedForDelivery = !!processedEvent;
              if (processedEvent) {
                processedForDeliveryDate = processedEvent.date;
              }
              if (
                item.status !== MailStatus.Draft &&
                (!processedForDelivery ||
                  differenceInBusinessDays(
                    processedForDeliveryDate,
                    new Date()
                  ) <= 5)
              ) {
                return (
                  <LetterStatusCard
                    status={item.status}
                    date={item.dateCreated}
                    description={item.content}
                    onPress={async () => {
                      Segment.track('Contact View - Click on Letter Tracking');
                      try {
                        await getTrackingEvents(item.id);
                        this.props.navigation.navigate(Screens.MailTracking);
                      } catch (err) {
                        Segment.trackWithProperties(
                          'Letter Tracking - Loading Error',
                          { error: err }
                        );
                        dropdownError({
                          message: i18n.t('Error.cantLoadMail'),
                        });
                      }
                    }}
                    key={item.id}
                  />
                );
              }
              return null;
            }
            if (
              item.status !== MailStatus.Draft &&
              differenceInBusinessDays(
                item.dateCreated ? item.dateCreated : new Date(),
                new Date()
              ) <= 11
            )
              return (
                <LetterStatusCard
                  status={item.status}
                  date={item.dateCreated}
                  description={item.content}
                  onPress={async () => {
                    Segment.track('Contact View - Click on Letter Tracking');
                    try {
                      await getTrackingEvents(item.id);
                      this.props.navigation.navigate(Screens.MailTracking);
                    } catch (err) {
                      Segment.trackWithProperties(
                        'Letter Tracking - Loading Error',
                        { error: err }
                      );
                      dropdownError({
                        message: i18n.t('Error.cantLoadMail'),
                      });
                    }
                  }}
                  key={item.id}
                />
              );
            return null;
          })
        : null;

    const letterTrackingTitle =
      mail && mail.length > 0 ? (
        <Text
          style={[
            Typography.BASE_TITLE,
            {
              color: Colors.GRAY_500,
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
            await getMail();
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
                  this.props.navigation.navigate(Screens.UpdateContact);
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
              imageUri={contact.image?.uri}
              type={ProfilePicTypes.SingleContact}
            />
            <Text
              style={[
                Typography.FONT_SEMIBOLD,
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
              onPress={async () => {
                Segment.trackWithProperties(
                  'Contact View - Click on Send Letter',
                  {
                    Type:
                      this.props.composing.content.length ||
                      (this.props.composing.type === MailTypes.Letter &&
                        this.props.composing.image) ||
                      this.props.composing.type === MailTypes.Postcard
                        ? 'draft'
                        : 'blank',
                  }
                );
                if (
                  this.props.composing.content.length ||
                  (this.props.composing.type === MailTypes.Letter &&
                    this.props.composing.image) ||
                  (this.props.composing.type === MailTypes.Postcard &&
                    this.props.composing.design.image.uri.length)
                ) {
                  popupAlert({
                    title: i18n.t('Compose.letterInProgress'),
                    message: i18n.t('Compose.continueWritingAnd'),
                    buttons: [
                      {
                        text: i18n.t('Compose.continueWriting'),
                        onPress: async () => {
                          const draftContact = this.props.existingContacts.find(
                            (testContact) =>
                              testContact.id ===
                              this.props.composing.recipientId
                          );
                          if (draftContact) {
                            this.props.setActiveContact(draftContact);
                            if (
                              this.props.composing.type === MailTypes.Letter
                            ) {
                              this.props.navigation.navigate(
                                Screens.ComposeLetter
                              );
                            } else if (
                              this.props.composing.type === MailTypes.Postcard
                            ) {
                              if (
                                this.props.composing.design.custom ||
                                this.props.composing.design.subcategoryName ===
                                  'Library'
                              ) {
                                this.props.navigation.navigate(
                                  Screens.ComposePostcard,
                                  {
                                    category: {
                                      name: 'personal',
                                      id: -1,
                                      image: { uri: '' },
                                      blurb: '',
                                      subcategories: {},
                                    },
                                  }
                                );
                              }
                              const categories = await getCategories();
                              const category = categories.find(
                                (testCategory) =>
                                  this.props.composing.type ===
                                    MailTypes.Postcard &&
                                  testCategory.id ===
                                    this.props.composing.design.categoryId
                              );
                              if (!category) return;
                              this.props.navigation.navigate(
                                Screens.ComposePostcard,
                                {
                                  category,
                                }
                              );
                            }
                          } else {
                            dropdownError({
                              message: i18n.t('Compose.draftContactDeleted'),
                            });
                            await deleteDraft();
                            this.props.navigation.navigate(
                              Screens.ChooseCategory
                            );
                          }
                        },
                      },
                      {
                        text: i18n.t('Compose.startNewLetter'),
                        reverse: true,
                        onPress: async () => {
                          await deleteDraft();
                          this.props.setComposing({
                            type: MailTypes.Letter,
                            recipientId: this.props.activeContact.id,
                            content: '',
                          });
                          this.props.navigation.navigate(
                            Screens.ChooseCategory
                          );
                        },
                      },
                    ],
                  });
                } else {
                  await deleteDraft();
                  this.props.setComposing({
                    type: MailTypes.Letter,
                    recipientId: this.props.activeContact.id,
                    content: '',
                  });
                  this.props.navigation.navigate(Screens.ChooseCategory);
                }
              }}
              buttonText={i18n.t('SingleContactScreen.sendLetter')}
              textStyle={(Typography.FONT_SEMIBOLD, { fontSize: 20 })}
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
              letterCount={mail ? mail.length : 0}
              onPress={() => {
                this.props.setActiveContact(contact);
                this.props.navigation.navigate(Screens.MemoryLane);
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
  existingMail: state.mail.existing[state.contact.active.id],
  existingContacts: state.contact.existing,
  userState: state.user,
  currentNotif: state.notif.currentNotif,
  composing: state.mail.composing,
});
const mapDispatchToProps = (
  dispatch: Dispatch<MailActionTypes | ContactActionTypes | NotifActionTypes>
) => ({
  setActiveContact: (contact: Contact) => dispatch(setActiveContact(contact)),
  setActiveLetter: (mail: Mail) => dispatch(setActiveLetter(mail)),
  setComposing: (draft: Draft) => dispatch(setComposing(draft)),
  handleNotif: () => dispatch(handleNotif()),
});
const SingleContactScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleContactScreenBase);

export default SingleContactScreen;
