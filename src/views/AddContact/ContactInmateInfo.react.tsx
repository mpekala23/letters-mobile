import React, { createRef, Dispatch } from 'react';
import { AppStackParamList, Screens } from '@utils/Screens';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, Typography } from '@styles';
import { Button, Icon, Input, KeyboardAvoider } from '@components';
import i18n from '@i18n';
import {
  setAddingFacility,
  setAddingInmateInfo,
} from '@store/Contact/ContactActions';
import { connect } from 'react-redux';
import Letter from '@assets/views/AddContact/Letter';
import {
  ContactDraft,
  ContactFacility,
  ContactInmateInfo,
  Facility,
  PrisonTypes,
} from 'types';
import { ContactActionTypes } from '@store/Contact/ContactTypes';
import { AppState } from '@store/types';
import * as Segment from 'expo-analytics-segment';
import { setProfileOverride } from '@components/Topbar/Topbar.react';

import { STATE_TO_ABBREV, STATE_TO_INMATE_DB, Validation } from '@utils';
import CommonStyles from './AddContact.styles';

type ContactInmateInfoScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  Screens.ContactInmateInfo
>;

export interface Props {
  navigation: ContactInmateInfoScreenNavigationProp;
  contactDraft: ContactDraft;
  route: { params: { manual: boolean; prisonType: PrisonTypes } };
  setAddingInmateInfo: (contactInmateInfo: ContactInmateInfo) => void;
  setAddingFacility: (contactFacility: ContactFacility) => void;
}

export interface State {
  valid: boolean;
}

class InmateInfoScreenBase extends React.Component<Props, State> {
  private scrollView = createRef<ScrollView>();

  private inmateNumber = createRef<Input>();

  private unit = createRef<Input>();

  private dorm = createRef<Input>();

  private postal = createRef<Input>();

  private facilityName = createRef<Input>();

  private facilityAddress = createRef<Input>();

  private unsubscribeFocus: () => void;

  private unsubscribeBlur: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      valid: false,
    };
    this.updateValid = this.updateValid.bind(this);
    this.onNextPress = this.onNextPress.bind(this);
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.unsubscribeFocus = props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );
    this.onNavigationBlur = this.onNavigationBlur.bind(this);
    this.unsubscribeBlur = this.props.navigation.addListener(
      'blur',
      this.onNavigationBlur
    );
  }

  componentDidMount() {
    this.loadValuesFromStore();
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
    this.unsubscribeBlur();
  }

  onNavigationFocus() {
    this.loadValuesFromStore();
    setProfileOverride({
      enabled: this.state.valid,
      text: i18n.t('ContactInmateInfoScreen.next'),
      action: this.onNextPress,
    });
  }

  onNavigationBlur = () => {
    setProfileOverride(undefined);
  };

  onNextPress() {
    Segment.trackWithProperties('Add Contact - Click on Next', {
      page: 'inmate info',
    });
    if (
      (this.inmateNumber.current ||
        this.props.route.params.prisonType === PrisonTypes.Juvenile) &&
      this.postal.current &&
      this.facilityName.current &&
      this.facilityAddress.current
    ) {
      const contactInmateInfo: ContactInmateInfo = {
        inmateNumber: this.inmateNumber.current
          ? this.inmateNumber.current.state.value
          : '-',
        unit: this.unit.current?.state.value,
        dorm: this.dorm.current?.state.value,
      };
      this.props.setAddingInmateInfo(contactInmateInfo);
      const facility: Facility = {
        ...this.props.contactDraft.facility,
        name: this.facilityName.current.state.value,
        address: this.facilityAddress.current.state.value,
        postal: this.facilityAddress.current.state.value,
      };
      this.props.setAddingFacility({ facility });

      this.props.navigation.setParams({
        manual: this.props.route.params.manual,
      });
      this.props.navigation.navigate(Screens.ReviewContact, {
        manual: this.props.route.params.manual,
      });
    }
  }

  setStoreValues = () => {
    if (
      this.inmateNumber.current &&
      this.postal.current &&
      this.facilityName.current &&
      this.facilityAddress.current
    ) {
      const contactInmateInfo: ContactInmateInfo = {
        inmateNumber: this.inmateNumber?.current.state.value,
        unit: this.unit.current?.state.value,
        dorm: this.dorm.current?.state.value,
      };
      this.props.setAddingInmateInfo(contactInmateInfo);
      const facility: Facility = {
        ...this.props.contactDraft.facility,
        name: this.facilityName.current.state.value,
        address: this.facilityAddress.current.state.value,
        postal: this.facilityAddress.current.state.value,
      };
      this.props.setAddingFacility({ facility });

      this.props.navigation.setParams({
        manual: this.props.route.params.manual,
      });
    }
  };

  setValid(val: boolean) {
    this.setState({ valid: val });
    setProfileOverride({
      enabled: val,
      text: i18n.t('ContactInmateInfoScreen.next'),
      action: this.onNextPress,
    });
  }

  loadValuesFromStore() {
    const addingContact = this.props.contactDraft;

    if (this.inmateNumber.current)
      this.inmateNumber.current.set(addingContact.inmateNumber);

    if (this.facilityName.current)
      this.facilityName.current.set(addingContact.facility.name);

    if (this.facilityAddress.current)
      this.facilityAddress.current.set(addingContact.facility.address);

    if (this.postal.current)
      this.postal.current.set(addingContact.facility.postal);
  }

  updateValid() {
    if (
      this.inmateNumber.current &&
      this.postal.current &&
      this.facilityName.current &&
      this.facilityAddress.current
    ) {
      const result =
        (this.inmateNumber.current?.state.valid ||
          this.props.route.params.prisonType === PrisonTypes.Juvenile) &&
        this.postal.current.state.valid &&
        this.facilityName.current.state.valid &&
        this.facilityAddress.current.state.valid;
      this.setValid(result);
    }
  }

  render() {
    const { state } = this.props.contactDraft.facility;
    const inmateDatabaseLink = STATE_TO_INMATE_DB[STATE_TO_ABBREV[state]]?.link;
    const tapHereToSearchStateDatabase =
      inmateDatabaseLink && inmateDatabaseLink !== '' ? (
        <Button
          link
          containerStyle={{ marginBottom: 20, alignSelf: 'flex-start' }}
          onPress={() => {
            Segment.trackWithProperties('Add Contact - Click on State Search', {
              State: state,
            });
            this.setStoreValues();
            this.props.navigation.navigate('InmateLocator', {
              uri: inmateDatabaseLink,
            });
          }}
        >
          <Text style={{ color: Colors.PINK_500 }}>
            {i18n.t('ContactInmateInfoScreen.tapHereToSearch')}{' '}
            <Text
              style={[Typography.FONT_SEMIBOLD, { color: Colors.PINK_500 }]}
            >
              {state}
            </Text>{' '}
            {i18n.t('ContactInmateInfoScreen.database')}.
          </Text>
        </Button>
      ) : null;

    return (
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'white' }}
        onPress={() => Keyboard.dismiss()}
        activeOpacity={1.0}
      >
        <KeyboardAvoider
          style={{ flexDirection: 'column', justifyContent: 'center' }}
        >
          <TouchableOpacity
            activeOpacity={1.0}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ScrollView
              ref={this.scrollView}
              keyboardShouldPersistTaps="handled"
              style={{ width: '100%' }}
            >
              <TouchableOpacity
                activeOpacity={1.0}
                style={CommonStyles.contactbackground}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Typography.PageHeader
                    text={i18n.t('ContactInmateInfoScreen.addDetails')}
                  />
                  <Icon svg={Letter} style={{ margin: 16 }} />
                </View>
                <Text
                  style={[
                    Typography.FONT_MEDIUM,
                    {
                      color: Colors.GRAY_500,
                      marginTop: 8,
                      fontSize: 15,
                    },
                  ]}
                >
                  {i18n.t(
                    'ContactInmateInfoScreen.needHelpFindingYourInmateID'
                  )}
                </Text>
                <Button
                  link
                  containerStyle={{
                    marginTop: 12,
                    marginBottom: 12,
                    alignSelf: 'flex-start',
                  }}
                  onPress={() => {
                    Segment.track('Add Contact - Click on Federal Search');
                    this.setStoreValues();
                    this.props.navigation.navigate('InmateLocator', {
                      uri: 'https://www.bop.gov/mobile/find_inmate/byname.jsp',
                    });
                  }}
                >
                  <Text style={{ color: Colors.PINK_500 }}>
                    {i18n.t('ContactInmateInfoScreen.tapHereToSearch')}{' '}
                    <Text
                      style={[
                        Typography.FONT_SEMIBOLD,
                        { color: Colors.PINK_500 },
                      ]}
                    >
                      {i18n.t('ContactInmateInfoScreen.federal')}
                    </Text>{' '}
                    {i18n.t('ContactInmateInfoScreen.database')}.
                  </Text>
                </Button>
                {tapHereToSearchStateDatabase}
                <Input
                  ref={this.facilityName}
                  placeholder={i18n.t('AddManuallyScreen.facilityName')}
                  required
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.postal}
                  placeholder={i18n.t('ContactInfoScreen.postal')}
                  required
                  validate={Validation.Postal}
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.facilityAddress}
                  placeholder={i18n.t('AddManuallyScreen.facilityAddress')}
                  required
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                {this.props.route.params.prisonType !==
                  PrisonTypes.Juvenile && (
                  <Input
                    ref={this.inmateNumber}
                    parentStyle={CommonStyles.fullWidth}
                    placeholder={i18n.t('ContactInmateInfoScreen.inmateNumber')}
                    required
                    validate={Validation.InmateNumber}
                    onValid={this.updateValid}
                    onInvalid={() => this.setValid(false)}
                  />
                )}
                <Input
                  ref={this.unit}
                  placeholder={i18n.t('ReviewContactScreen.optionalUnit')}
                />
                <Input
                  ref={this.dorm}
                  placeholder={i18n.t('ReviewContactScreen.optionalDorm')}
                />
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </KeyboardAvoider>
      </TouchableOpacity>
    );
  }
}
const mapStateToProps = (state: AppState) => ({
  contactDraft: state.contact.adding,
});
const mapDispatchToProps = (dispatch: Dispatch<ContactActionTypes>) => {
  return {
    setAddingInmateInfo: (contactInmateInfo: ContactInmateInfo) =>
      dispatch(setAddingInmateInfo(contactInmateInfo)),
    setAddingFacility: (contactFacility: ContactFacility) =>
      dispatch(setAddingFacility(contactFacility)),
  };
};
const ContactInmateInfoScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(InmateInfoScreenBase);

export default ContactInmateInfoScreen;
