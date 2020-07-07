import React, { Dispatch } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, GrayBar } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { Letter, LetterStatus } from 'types';
import { Typography, Colors } from '@styles';
import {
  setDraft,
  setStatus,
  clearComposing,
} from '@store/Letter/LetterActions';
import { createLetter } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import i18n from '@i18n';
import { LetterActionTypes } from '@store/Letter/LetterTypes';
import Styles from './Compose.styles';

type LetterPreviewScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'LetterPreview'
>;

interface Props {
  navigation: LetterPreviewScreenNavigationProp;
  composing: Letter;
  setDraft: (value: boolean) => void;
  setStatus: (status: LetterStatus) => void;
  clearComposing: () => void;
}

const LetterPreviewScreenBase: React.FC<Props> = (props: Props) => {
  return (
    <View style={Styles.screenBackground}>
      <View style={{ flex: 1 }}>
        <Text style={[Typography.FONT_BOLD, { fontSize: 36 }]}>
          {i18n.t('Compose.preview')}
        </Text>
        <GrayBar />
        <ScrollView>
          <Text
            style={[Typography.FONT_REGULAR, { marginTop: 20, fontSize: 14 }]}
          >
            {props.composing.message}
          </Text>
        </ScrollView>
      </View>
      <Text
        style={[
          Typography.FONT_REGULAR,
          {
            fontSize: 20,
            color: Colors.GRAY_DARK,
            textAlign: 'center',
            margin: 10,
          },
        ]}
      >
        {i18n.t('Compose.warningCantCancel')}
      </Text>
      <Button
        buttonText={i18n.t('Compose.send')}
        onPress={async () => {
          try {
            props.setDraft(false);
            await createLetter(props.composing);
            props.setStatus(LetterStatus.Created);
            props.clearComposing();
            props.navigation.navigate('ContactSelector');
          } catch (err) {
            props.setDraft(true);
            dropdownError({
              message: i18n.t('Error.requestIncomplete'),
            });
          }
        }}
      />
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  composing: state.letter.composing,
});
const mapDispatchToProps = (dispatch: Dispatch<LetterActionTypes>) => {
  return {
    clearComposing: () => dispatch(clearComposing()),
    setDraft: (value: boolean) => dispatch(setDraft(value)),
    setStatus: (status: LetterStatus) => dispatch(setStatus(status)),
  };
};
const LetterPreviewScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(LetterPreviewScreenBase);

export default LetterPreviewScreen;
