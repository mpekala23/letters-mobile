import React, { Dispatch } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { Colors, Typography } from '@styles';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Input, Icon } from '@components';
import { Facility } from 'types';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setAdding } from '@store/Contact/ContactActions';
import {
  ContactState,
  Contact,
  ContactActionTypes,
} from '@store/Contact/ContactTypes';
import i18n from '@i18n';
import FacilityIcon from '@assets/views/AddContact/Facility';
import { ScrollView } from 'react-native-gesture-handler';
import { getFacilities } from '@api';
import { STATE_TO_ABBREV } from '@utils';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { setProfileOverride } from '@components/Topbar/Topbar.react';
import Styles from './FacilityDirectory.styles';

type ContactInfoScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'FacilityDirectory'
>;

export interface Props {
  navigation: ContactInfoScreenNavigationProp;
  route: {
    params: { phyState: string };
  };
  contactState: ContactState;
  setAdding: (contact: Contact) => void;
}

export interface State {
  facilityData: Facility[];
  phyState: string;
  search: string;
  selected: Facility | null;
  manual: Facility | null;
  refreshing: boolean;
}

class FacilityDirectoryScreenBase extends React.Component<Props, State> {
  private unsubscribeFocus: () => void;

  private unsubscribeBlur: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      facilityData: [],
      phyState: '',
      search: '',
      selected: null,
      manual: null,
      refreshing: true,
    };
    this.renderItem = this.renderItem.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.filterData = this.filterData.bind(this);
    this.refreshFacilities = this.refreshFacilities.bind(this);
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

  async componentDidMount() {
    this.loadValuesFromStore();
    await this.refreshFacilities();
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
    this.unsubscribeBlur();
  }

  onNavigationBlur = () => {
    setProfileOverride(undefined);
  };

  onNavigationFocus() {
    this.loadValuesFromStore();
    setProfileOverride({
      enabled: this.state.selected !== null,
      text: i18n.t('ContactInfoScreen.next'),
      action: () => {
        const contact = this.props.contactState.adding;
        contact.facility = this.state.selected;
        this.props.setAdding(contact);
        this.props.navigation.navigate('ReviewContact');
      },
    });
  }

  setValid(val: boolean) {
    setProfileOverride({
      enabled: val,
      text: i18n.t('ContactInfoScreen.next'),
      action: () => {
        const contact = this.props.contactState.adding;
        contact.facility = this.state.selected;
        this.props.setAdding(contact);
        this.props.navigation.navigate('ReviewContact');
      },
    });
  }

  loadValuesFromStore() {
    this.setState({ selected: this.props.contactState.adding.facility });
    let phyState;
    if (this.props.route.params && this.props.route.params.phyState) {
      phyState = this.props.route.params.phyState;
      this.setState({ phyState: this.props.route.params.phyState });
    }
    this.props.navigation.setParams({ phyState });
    this.refreshFacilities();
  }

  async refreshFacilities() {
    try {
      const { phyState } = this.props.route.params;
      this.setState({ refreshing: true });
      const facilities = await getFacilities(STATE_TO_ABBREV[phyState]);
      this.setState({ facilityData: facilities, refreshing: false });
    } catch (err) {
      dropdownError({ message: i18n.t('Error.cantRefreshFacilities') });
      this.setState({ refreshing: false });
    }
  }

  filterData() {
    const result = [];
    for (let ix = 0; ix < this.state.facilityData.length; ix += 1) {
      const facility = this.state.facilityData[ix];
      const search = this.state.search.toLowerCase();
      if (
        facility.name.toLowerCase().indexOf(search) > -1 ||
        facility.city.toLowerCase().indexOf(search) > -1 ||
        facility.postal.toLowerCase().indexOf(search) > -1 ||
        facility.state.toLowerCase().indexOf(search) > -1
      ) {
        result.push(facility);
      }
    }
    return result;
  }

  renderItem({ item }: { item: Facility }) {
    return (
      <TouchableOpacity
        style={[
          Styles.shadow,
          Styles.itemBackground,
          this.state.selected === item ? Styles.selectedBackground : {},
        ]}
        onPress={() => {
          if (this.state.selected === item) {
            this.setState({ selected: null });
            this.setValid(false);
          } else {
            this.setState({ selected: item });
            this.setValid(true);
          }
        }}
        key={item.name + item.address}
      >
        <Text style={[Typography.FONT_BOLD, Styles.itemTitle]}>
          {item.name}
        </Text>
        <Text style={[Typography.FONT_REGULAR, Styles.itemInfo]}>
          {item.type}
        </Text>
        <Text style={[Typography.FONT_REGULAR, Styles.itemInfo]}>
          {item.address} - {item.city}, {item.state} {item.postal}
        </Text>
      </TouchableOpacity>
    );
  }

  renderFooter() {
    const manualEntry = this.state.manual ? (
      <View>
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: Colors.GRAY_LIGHT,
            marginBottom: 8,
          }}
        />
        {this.renderItem({ item: this.state.manual })}
      </View>
    ) : (
      <View />
    );
    return (
      <View style={Styles.footerBackground}>
        {manualEntry}
        <Text style={[Typography.BASE_TEXT, { marginBottom: 20 }]}>
          {i18n.t('FacilityDirectoryScreen.dontSeeTheFacility')}
        </Text>
        <Button
          buttonText={i18n.t('FacilityDirectoryScreen.addManually')}
          containerStyle={Styles.addManuallyButton}
          onPress={() => {
            this.setState({ selected: null });
            this.props.navigation.navigate('AddManually', {
              phyState: this.state.phyState,
            });
          }}
        />
      </View>
    );
  }

  render() {
    const facilityDirectoryHint =
      this.state.phyState === 'Pennsylvania' ? (
        <View style={Styles.hintBackground} testID="hintText">
          <Text style={[Typography.FONT_MEDIUM]}>
            {i18n.t('FacilityDirectoryScreen.PennsylvaniaHint1')}{' '}
            <Text style={Typography.FONT_BOLD}>
              {i18n.t('FacilityDirectoryScreen.statePrison')}{' '}
            </Text>
            {i18n.t('FacilityDirectoryScreen.PennsylvaniaHint2')}{' '}
            <Text style={Typography.FONT_BOLD}>
              &apos;{i18n.t('FacilityDirectoryScreen.smartCommunications')}
              &apos;
            </Text>{' '}
            {i18n.t('FacilityDirectoryScreen.PennsylvaniaHint3')}
          </Text>
        </View>
      ) : null;
    const refresh = (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={async () => {
          this.setState({ refreshing: true });
          try {
            const facilities = await getFacilities(
              STATE_TO_ABBREV[this.props.route.params.phyState]
            );
            this.setState({ facilityData: facilities });
          } catch (err) {
            dropdownError({ message: i18n.t('Error.cantRefreshFacilities') });
          }
          this.setState({ refreshing: false });
        }}
      />
    );

    return (
      <TouchableOpacity
        style={Styles.facilityBackground}
        onPress={Keyboard.dismiss}
        activeOpacity={1.0}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : -200}
          enabled
        >
          <View style={Styles.topSection}>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-start',
                paddingTop: 16,
              }}
            >
              <Typography.PageHeader
                text={i18n.t('FacilityDirectoryScreen.facilityDirectory')}
              />
              <Icon svg={FacilityIcon} style={{ margin: 16 }} />
            </View>
            {facilityDirectoryHint}
            <Input
              parentStyle={Styles.searchParent}
              inputStyle={Styles.searchInput}
              placeholder={i18n.t('FacilityDirectoryScreen.searchFacility')}
              onChangeText={(val: string) => {
                this.setState({ search: val });
              }}
            />
          </View>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            scrollEnabled
            overScrollMode="always"
            refreshControl={refresh}
          >
            <View style={{ width: '100%', height: 24 }} />
            {this.filterData().map((value) => this.renderItem({ item: value }))}
            {this.renderFooter()}
            <View style={{ width: '100%', height: 24 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  contactState: state.contact,
});
const mapDispatchToProps = (dispatch: Dispatch<ContactActionTypes>) => {
  return {
    setAdding: (contact: Contact) => dispatch(setAdding(contact)),
  };
};
const FacilityDirectoryScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(FacilityDirectoryScreenBase);

export default FacilityDirectoryScreen;
