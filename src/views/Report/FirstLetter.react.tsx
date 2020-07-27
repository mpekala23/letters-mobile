import React, { Dispatch } from 'react';
import { Text, View } from 'react-native';
import { Typography } from '@styles';
import { Button, Icon } from '@components';
import Mail from '@assets/views/Report/MailLoud';
import { AppState } from '@store/types';
import { connect } from 'react-redux';
import { NotifActionTypes, Notif, HANDLE_NOTIF } from '@store/Notif/NotifTypes';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import ReportStyles from './Report.styles';
import Styles from './FirstLetter.styles';

type FirstLetterScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'FirstLetter'
>;

interface Props {
  currentNotif: Notif | null;
  handleNotif: () => void;
  navigation: FirstLetterScreenNavigationProp;
}

class FirstLetterScreenBase extends React.Component<Props> {
  componentDidMount(): void {
    if (this.props.currentNotif) this.props.handleNotif();
  }

  render(): JSX.Element {
    return (
      <View style={Styles.background}>
        <View style={Styles.innerBack}>
          <Text style={[Typography.FONT_BOLD, ReportStyles.question]}>
            How was your first letter?
          </Text>
          <Icon svg={Mail} style={{ marginVertical: 30, left: 14 }} />
          <Text
            style={[
              Typography.FONT_REGULAR,
              {
                fontSize: 16,
                textAlign: 'center',
                color: '#515151',
                marginHorizontal: 20,
                marginBottom: 30,
              },
            ]}
          >
            If there was a problem with delivery and your loved one
            didn`&apos;`t receive the letter, let us know.
          </Text>
          <Button
            buttonText="It was fire"
            onPress={() => {
              this.props.navigation.navigate('Home');
            }}
            containerStyle={{ width: '100%' }}
          />
          <Button
            buttonText="Something went wrong"
            onPress={() => {
              this.props.navigation.navigate('Issues');
            }}
            containerStyle={{ width: '100%' }}
            reverse
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    currentNotif: state.notif.currentNotif,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<NotifActionTypes>) => {
  return {
    handleNotif: () => dispatch({ type: HANDLE_NOTIF, payload: null }),
  };
};

const FirstLetterScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstLetterScreenBase);

export { FirstLetterScreenBase };
export default FirstLetterScreen;
