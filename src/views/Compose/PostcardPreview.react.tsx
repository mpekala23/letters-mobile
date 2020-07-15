import React, { Dispatch } from 'react';
import { View, Text, Image } from 'react-native';
import { Button, GenericCard, Icon, GrayBar } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { Letter, LetterStatus } from 'types';
import { Colors, Typography } from '@styles';
import {
  setDraft,
  setStatus,
  clearComposing,
} from '@store/Letter/LetterActions';
import { createLetter } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import i18n from '@i18n';
import { LetterActionTypes } from '@store/Letter/LetterTypes';
import Stamp from '@assets/views/Compose/Stamp';
import Styles from './Compose.styles';

type PostcardPreviewScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'PostcardPreview'
>;

interface Props {
  navigation: PostcardPreviewScreenNavigationProp;
  composing: Letter;
  recipientName: string;
  setDraft: (value: boolean) => void;
  setStatus: (status: LetterStatus) => void;
  clearComposing: () => void;
}

const PostcardPreviewScreenBase: React.FC<Props> = (props: Props) => {
  return (
    <View style={Styles.screenBackground}>
      <View style={{ flex: 1 }}>
        <GenericCard style={Styles.postcardBackground}>
          <View style={{ flex: 1 }}>
            {props.composing.photo && (
              <Image
                source={{ uri: props.composing.photo?.uri }}
                style={{ width: '100%', aspectRatio: 1 }}
              />
            )}
          </View>
          <GrayBar vertical />
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Icon svg={Stamp} style={{ alignSelf: 'flex-end' }} />
            <Text style={Typography.FONT_REGULAR}>
              {i18n.t('Compose.to')}: {props.recipientName}
            </Text>
            <GrayBar />
            <GrayBar />
            <GrayBar />
            <GrayBar />
            <GrayBar />
            <GrayBar />
          </View>
        </GenericCard>
        <GenericCard style={{ minHeight: 200 }}>
          <Text
            style={[Typography.FONT_REGULAR, { marginTop: 20, fontSize: 14 }]}
          >
            {props.composing.content}
          </Text>
        </GenericCard>
      </View>
      <Text
        style={[
          Typography.FONT_REGULAR,
          {
            fontSize: 12,
            color: Colors.GRAY_MEDIUM,
            textAlign: 'center',
            margin: 10,
          },
        ]}
      >
        {i18n.t('Compose.warningCantCancel')}
      </Text>
      <Button
        buttonText={i18n.t('Compose.sendPostcard')}
        onPress={async () => {
          try {
            props.setDraft(false);
            await createLetter(props.composing);
            props.setStatus(LetterStatus.Created);
            props.clearComposing();
            props.navigation.navigate('ReferFriends');
          } catch (err) {
            props.setDraft(true);
            if (err.message === 'Unable to upload image.') {
              dropdownError({ message: i18n.t('unableToUploadLetterPhoto') });
            } else {
              dropdownError({
                message: i18n.t('Error.requestIncomplete'),
              });
            }
          }
        }}
      />
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  composing: state.letter.composing,
  recipientName: state.contact.active.firstName,
});
const mapDispatchToProps = (dispatch: Dispatch<LetterActionTypes>) => {
  return {
    clearComposing: () => dispatch(clearComposing()),
    setDraft: (value: boolean) => dispatch(setDraft(value)),
    setStatus: (status: LetterStatus) => dispatch(setStatus(status)),
  };
};
const PostcardPreviewScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(PostcardPreviewScreenBase);

export default PostcardPreviewScreen;
