import React, { Dispatch } from 'react';
import { View, Text, TouchableOpacity, Keyboard, FlatList } from 'react-native';
import { Colors, Typography } from '@styles';
import { AppStackParamList, Screens } from '@utils/Screens';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Input, Icon, KeyboardAvoider } from '@components';
import { Facility, ContactFacility } from 'types';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setAddingFacility } from '@store/Contact/ContactActions';
import { ContactState, ContactActionTypes } from '@store/Contact/ContactTypes';
import i18n from '@i18n';
import FacilityIcon from '@assets/views/AddContact/Facility';
import { getFacilities } from '@api';
import { STATE_TO_ABBREV } from '@utils';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { setProfileOverride } from '@components/Topbar/Topbar.react';
import * as Segment from 'expo-analytics-segment';
import { FacilityState } from '@store/Facility/FacilityTypes';
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
  setAddingFacility: (contactFacility: ContactFacility) => void;
  facilityState: FacilityState;
}

export interface State {
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
      phyState: '',
      search: '',
      selected: null,
      manual: null,
      refreshing: false,
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
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
    this.unsubscribeBlur();
  }

  onNavigationBlur = () => {
    setProfileOverride(undefined);
  };

  onNavigationFocus() {
    if (!this.props.facilityState.loaded) {
      this.refreshFacilities();
    }
    this.loadValuesFromStore();
    setProfileOverride({
      enabled: this.state.selected !== null,
      text: i18n.t('ContactInfoScreen.next'),
      action: () => {
        Segment.trackWithProperties('Add Contact - Click on Next', {
          page: 'facility',
        });
        if (this.state.selected) {
          this.props.setAddingFacility({ facility: this.state.selected });
          this.props.navigation.navigate(Screens.ReviewContact, {
            manual: false,
          });
        }
      },
    });
  }

  setValid(val: boolean) {
    setProfileOverride({
      enabled: val,
      text: i18n.t('ContactInfoScreen.next'),
      action: () => {
        Segment.trackWithProperties('Add Contact - Click on Next', {
          page: 'facility',
        });
        if (this.state.selected) {
          this.props.setAddingFacility({ facility: this.state.selected });
          this.props.navigation.navigate(Screens.ReviewContact, {
            manual: false,
          });
        }
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
  }

  async refreshFacilities() {
    try {
      const { phyState } = this.props.route.params;
      await getFacilities(STATE_TO_ABBREV[phyState]);
    } catch (err) {
      dropdownError({ message: i18n.t('Error.cantRefreshFacilities') });
    }
  }

  filterData() {
    const search = this.state.search.toLowerCase();
    return this.props.facilityState.facilities
      .filter((facility) => {
        return (
          facility.name.toLowerCase().indexOf(search) > -1 ||
          facility.city.toLowerCase().indexOf(search) > -1 ||
          facility.postal.toLowerCase().indexOf(search) > -1 ||
          facility.state.toLowerCase().indexOf(search) > -1
        );
      })
      .sort((a, b) => {
        return a.fullName && b.fullName
          ? a.fullName.localeCompare(b.fullName)
          : a.name.localeCompare(b.name);
      });
  }

  renderItem({ item, index }: { item: Facility; index: number }) {
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
            Segment.track('Add Contact - Select Facility');
            this.setState({ selected: item });
            this.setValid(true);
          }
        }}
        key={
          (item.fullName
            ? item.fullName
            : item.name + item.address + item.postal) + index.toString()
        }
      >
        <Text style={[Typography.FONT_SEMIBOLD, Styles.itemTitle]}>
          {item.fullName ? item.fullName : item.name}
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
    if (!this.props.facilityState.loaded) {
      return null;
    }
    const manualEntry = this.state.manual ? (
      <View>
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: Colors.BLACK_200,
            marginBottom: 8,
          }}
        />
        {this.renderItem({ item: this.state.manual, index: -1 })}
      </View>
    ) : (
      <View />
    );
    return (
      <View style={Styles.footerBackground}>
        {manualEntry}
        <Text style={[Typography.BASE_TEXT, { marginBottom: 8 }]}>
          {i18n.t('FacilityDirectoryScreen.dontSeeTheFacility')}
        </Text>
        <Button
          buttonText={i18n.t('FacilityDirectoryScreen.addManually')}
          textStyle={{ textAlign: 'center' }}
          containerStyle={Styles.addManuallyButton}
          onPress={() => {
            Segment.track('Add Contact - Click on Manual Facility Add');
            this.setState({ selected: null });
            this.props.navigation.navigate(Screens.AddManually, {
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
            <Text style={Typography.FONT_SEMIBOLD}>
              {i18n.t('FacilityDirectoryScreen.statePrison')}{' '}
            </Text>
            {i18n.t('FacilityDirectoryScreen.PennsylvaniaHint2')}{' '}
            <Text style={Typography.FONT_SEMIBOLD}>
              &apos;{i18n.t('FacilityDirectoryScreen.smartCommunications')}
              &apos;
            </Text>{' '}
            {i18n.t('FacilityDirectoryScreen.PennsylvaniaHint3')}
          </Text>
        </View>
      ) : null;

    return (
      <TouchableOpacity
        style={Styles.facilityBackground}
        onPress={Keyboard.dismiss}
        activeOpacity={1.0}
      >
        <KeyboardAvoider>
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
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 24,
            }}
            data={this.filterData()}
            keyExtractor={(item, index) => {
              return (
                (item.fullName ? item.fullName : item.name) + index.toString()
              );
            }}
            renderItem={this.renderItem}
            refreshing={this.state.refreshing}
            onRefresh={this.refreshFacilities}
            ListFooterComponent={this.renderFooter()}
          />
        </KeyboardAvoider>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  contactState: state.contact,
  facilityState: state.facility,
});
const mapDispatchToProps = (dispatch: Dispatch<ContactActionTypes>) => {
  return {
    setAddingFacility: (contactFacility: ContactFacility) =>
      dispatch(setAddingFacility(contactFacility)),
  };
};
const FacilityDirectoryScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(FacilityDirectoryScreenBase);

export default FacilityDirectoryScreen;
