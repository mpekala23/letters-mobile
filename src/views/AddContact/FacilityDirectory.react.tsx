import React, { Dispatch } from 'react';
import { View, FlatList, Text, TouchableOpacity, Keyboard } from 'react-native';
import { Colors, Typography } from '@styles';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Input, Icon } from '@components';
import { Facility, NullableFacility } from 'types';
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
import { getFacilities } from '@api';
import { STATE_TO_ABBREV } from '@utils';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import CommonStyles from './AddContact.styles';
import Styles from './FacilityDirectory.styles';

type ContactInfoScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'FacilityDirectory'
>;

export interface Props {
  navigation: ContactInfoScreenNavigationProp;
  route: {
    params: { newFacility?: NullableFacility; phyState: string };
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
  }

  async componentDidMount() {
    this.onNavigationFocus();
    await this.refreshFacilities();
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
  }

  onNavigationFocus() {
    if (this.props.route.params && this.props.route.params.newFacility) {
      this.setState({
        manual: this.props.route.params.newFacility,
        selected: this.props.route.params.newFacility,
      });
    } else {
      this.setState({ selected: this.props.contactState.adding.facility });
    }
    let phyState;
    if (this.props.route.params && this.props.route.params.phyState) {
      phyState = this.props.route.params.phyState;
      this.setState({ phyState: this.props.route.params.phyState });
    }
    this.props.navigation.setParams({ newFacility: null, phyState });
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
          } else {
            this.setState({ selected: item });
          }
        }}
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
            marginBottom: 30,
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
      this.props.contactState.adding.state === 'Pennsylvania' ? (
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
    return (
      <TouchableOpacity
        style={Styles.facilityBackground}
        onPress={Keyboard.dismiss}
        activeOpacity={1.0}
      >
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
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
        <FlatList
          data={this.filterData()}
          renderItem={this.renderItem}
          onRefresh={this.refreshFacilities}
          refreshing={this.state.refreshing}
          contentContainerStyle={Styles.flatBackground}
          ListFooterComponent={this.renderFooter}
          keyExtractor={(item) => item.name}
        />
        <View style={CommonStyles.bottomButtonContainer}>
          <Button
            onPress={() => {
              const contact = this.props.contactState.adding;
              contact.facility = this.state.selected;
              this.props.setAdding(contact);
              this.props.navigation.setParams({
                newFacility: null,
              });
              this.props.navigation.navigate('ContactInfo', {
                phyState: this.props.route.params.phyState,
              });
            }}
            buttonText={i18n.t('ContactInfoScreen.back')}
            reverse
            containerStyle={CommonStyles.bottomButton}
          />
          <Button
            onPress={() => {
              const contact = this.props.contactState.adding;
              contact.facility = this.state.selected;
              this.props.setAdding(contact);
              this.props.navigation.setParams({
                newFacility: null,
              });
              this.props.navigation.navigate('ReviewContact');
            }}
            buttonText={i18n.t('ContactInfoScreen.next')}
            enabled={this.state.selected !== null}
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
