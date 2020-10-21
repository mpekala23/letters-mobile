import React, { Dispatch } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from 'react-native';
import { AdjustableText, Button, ProfilePic } from '@components';
import { AppStackParamList, Screens } from '@utils/Screens';
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
  Category,
  EntityTypes,
} from 'types';
import CreditsCard from '@components/Card/CreditsCard.react';
import LetterStatusCard from '@components/Card/LetterStatusCard.react';
import MemoryLaneCountCard from '@components/Card/MemoryLaneCountCard.react';
import i18n from '@i18n';
import {
  setActive as setActiveMail,
  setComposing,
} from '@store/Mail/MailActions';
import { MailActionTypes } from '@store/Mail/MailTypes';
import PencilIcon from '@assets/components/Card/Pencil';
import Icon from '@components/Icon/Icon.react';
import { connect } from 'react-redux';
import { setActive as setActiveContact } from '@store/Contact/ContactActions';
import { LinearGradient } from 'expo-linear-gradient';
import { getContact, getTrackingEvents, getMailByContact } from '@api';
import * as Sentry from 'sentry-expo';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { UserState } from '@store/User/UserTypes';
import { AppState } from '@store/types';
import * as Segment from 'expo-analytics-segment';
import { differenceInBusinessDays } from 'date-fns';
import { popupAlert } from '@components/Alert/Alert.react';
import { checkIfLoading } from '@store/selectors';
import { deleteDraft } from '@api/User';
import LetterTrackerPlaceholder from '@components/Loaders/LetterTrackerPlaceholder';
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
  setActiveMail: (mail: Mail | null) => void;
  setComposing: (draft: Draft) => void;
  setActiveContact: (contact: Contact) => void;
  composing: Draft;
  categories: Category[];
  isMailLoading: boolean;
}

class SingleContactScreenBase extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  render() {
    const contact = this.props.activeContact;
    const mail = this.props.existingMail;
    const letterCards =
      mail && mail.length > 0
        ? mail.map((item: Mail) => {
            if (
              item.status !== MailStatus.Draft &&
              differenceInBusinessDays(
                new Date(item.dateCreated),
                new Date()
              ) <= 12
            )
              return (
                <LetterStatusCard
                  status={item.status}
                  date={new Date(item.dateCreated)}
                  description={item.content}
                  onPress={async () => {
                    this.props.setActiveMail(item);
                    Segment.track('Contact View - Click on Letter Tracking');
                    getTrackingEvents(item.id).catch((err) => {
                      Sentry.captureException(err);
                      dropdownError({
                        message: i18n.t('Error.cantLoadMail'),
                      });
                    });
                    this.props.navigation.navigate(Screens.MailTracking);
                  }}
                  key={item.id}
                />
              );
            return null;
          })
        : null;

    const letterTrackingTitle = (
      <AdjustableText
        numberOfLines={1}
        style={[
          Typography.BASE_TITLE,
          {
            color: Colors.GRAY_400,
            paddingTop: 12,
          },
        ]}
      >
        {i18n.t('SingleContactScreen.letterTracking')}
      </AdjustableText>
    );

    const refresh = (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={async () => {
          this.setState({ refreshing: true });
          try {
            await getContact(this.props.activeContact);
            if (this.props.activeContact.hasNextPage) {
              await getMailByContact(
                this.props.activeContact,
                this.props.activeContact.mailPage
              );
            }
          } catch (err) {
            Sentry.captureException(err);
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
              colors={[
                this.props.activeContact.backgroundColor,
                this.props.activeContact.backgroundColor,
              ]}
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
            <AdjustableText
              numberOfLines={1}
              style={[
                Typography.FONT_SEMIBOLD,
                {
                  color: Colors.AMEELIO_BLACK,
                  fontSize: 25,
                },
              ]}
            >
              {contact.firstName} {contact.lastName}
            </AdjustableText>
            {contact.facility && (
              <View style={{ alignItems: 'center' }}>
                <AdjustableText
                  numberOfLines={1}
                  style={[Typography.FONT_REGULAR, Styles.profileCardInfo]}
                >
                  {contact.facility.name}
                </AdjustableText>

                <AdjustableText
                  numberOfLines={1}
                  style={[
                    Typography.FONT_REGULAR,
                    Styles.profileCardInfo,
                    { paddingBottom: 8 },
                  ]}
                >
                  {contact.facility.address}
                </AdjustableText>
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
                        this.props.composing.images.length) ||
                      this.props.composing.type === MailTypes.Postcard
                        ? 'draft'
                        : 'blank',
                  }
                );
                if (
                  this.props.composing.content.length ||
                  (this.props.composing.type === MailTypes.Letter &&
                    this.props.composing.images.length) ||
                  (this.props.composing.type === MailTypes.Postcard &&
                    (this.props.composing.design.image.uri.length ||
                      this.props.composing.design.layout ||
                      this.props.composing.design.stickers))
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
                                  Screens.ComposePersonal
                                );
                              }
                              const category = this.props.categories.find(
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
                            await deleteDraft();
                            dropdownError({
                              message: i18n.t('Compose.draftContactDeleted'),
                            });
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
                            images: [],
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
                    images: [],
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
              letterCount={this.props.activeContact.totalSent}
              onPress={() => {
                this.props.setActiveContact(contact);
                this.props.navigation.navigate(Screens.MemoryLane);
              }}
              style={{ height: 100 }}
              isLoading={this.props.isMailLoading}
            >
              <Icon
                svg={PencilIcon}
                style={{ position: 'absolute', top: 8, right: 12 }}
              />
            </MemoryLaneCountCard>
            {letterTrackingTitle}
            {this.props.isMailLoading ? (
              <View>
                <View>
                  <LetterTrackerPlaceholder />
                </View>
                <View style={{ marginTop: 16 }}>
                  <LetterTrackerPlaceholder />
                </View>
              </View>
            ) : (
              letterCards
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  activeContact: state.contact.active,
  existingMail: state.mail.existing[state.contact.active.id],
  allMail: state.mail.existing,
  existingContacts: state.contact.existing,
  userState: state.user,
  composing: state.mail.composing,
  categories: state.category.categories,
  isMailLoading: checkIfLoading(state, EntityTypes.Mail),
});
const mapDispatchToProps = (
  dispatch: Dispatch<MailActionTypes | ContactActionTypes>
) => ({
  setActiveContact: (contact: Contact) => dispatch(setActiveContact(contact)),
  setActiveMail: (mail: Mail | null) => dispatch(setActiveMail(mail)),
  setComposing: (draft: Draft) => dispatch(setComposing(draft)),
});
const SingleContactScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleContactScreenBase);

export default SingleContactScreen;
