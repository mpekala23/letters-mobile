import React, { Dispatch } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Typography } from '@styles';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Input, Icon, GrayBar } from '@components';
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
import { ScrollView } from 'react-native-gesture-handler';
import CommonStyles from './AddContact.styles';
import Styles from './FacilityDirectory.styles';

type ContactInfoScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'FacilityDirectory'
>;

export interface Props {
  facilityData: Facility[];
  navigation: ContactInfoScreenNavigationProp;
  route: {
    params: { newFacility: NullableFacility };
  };
  contactState: ContactState;
  setAdding: (contact: Contact) => void;
}

export interface State {
  search: string;
  selected: Facility | null;
  manual: Facility | null;
}

const example: Facility = {
  name: 'Yukon Kskokwim Correctional Center',
  type: 'State Prison',
  address: 'P.O. Box 400',
  city: 'Bethel',
  state: 'AK',
  postal: '99559',
};

class FacilityDirectoryScreenBase extends React.Component<Props, State> {
  private unsubscribeFocus: () => void;

  static defaultProps = {
    facilityData: [example],
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      search: '',
      selected: null,
      manual: null,
    };
    this.renderItem = this.renderItem.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.filterData = this.filterData.bind(this);
    this.unsubscribeFocus = props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );
  }

  componentDidMount() {
    this.onNavigationFocus();
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
    this.props.navigation.setParams({ newFacility: null });
  }

  filterData() {
    const result = [];
    for (let ix = 0; ix < this.props.facilityData.length; ix += 1) {
      const facility = this.props.facilityData[ix];
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
            this.props.navigation.navigate('AddManually');
          }}
        />
      </View>
    );
  }

  render() {
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
          >
            <View style={{ width: '100%', height: 24 }} />
            {this.filterData().map((value) => this.renderItem({ item: value }))}
            {this.renderFooter()}
            <View style={{ width: '100%', height: 24 }} />
          </ScrollView>
          <View style={CommonStyles.bottomButtonContainer}>
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
