import { AsyncImage } from '@components';
import React, { Dispatch, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, Screens } from '@utils/Screens';
import CardStyles from '@components/Card/Card.styles';
import { Category, Draft, DraftPostcard, PostcardSizeOption } from 'types';
import i18n from '@i18n';
import { Typography } from '@styles';
import { POSTCARD_SIZE_OPTIONS } from '@utils/Constants';
import { setProfileOverride } from '@components/Topbar/Topbar.react';
import { connect } from 'react-redux';
import { setComposing } from '@store/Mail/MailActions';
import { MailActionTypes } from '@store/Mail/MailTypes';
import { AppState } from '@store/types';
import Styles from './SelectPostcardSize.styles';
// interface Props {}

type SelectPostcardSizeScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  Screens.SelectPostcardSize
>;

interface Props {
  navigation: SelectPostcardSizeScreenNavigationProp;
  route: {
    params: { category: Category };
  };
  updateDraft: (draft: Draft) => void;
  draft: Draft;
}

const SelectPostcardSizeBase = ({
  navigation,
  route,
  updateDraft,
  draft,
}: Props) => {
  const [selected, setSelected] = useState<PostcardSizeOption>(draft.size);

  const updatePostcardOption = async () => {
    navigation.navigate(Screens.ComposePostcard, {
      category: route.params.category,
    });
  };

  useEffect(() => {
    updateDraft({ ...draft, size: selected } as DraftPostcard);
    setProfileOverride({
      enabled: !!selected,
      text: i18n.t('UpdateProfileScreen.save'),
      action: updatePostcardOption,
      blocking: true,
    });
  });

  const renderItem = (option: PostcardSizeOption) => {
    const { image, title, wordsLimit, cost, isPremium } = option;
    // const borderStyle =
    // selected.key === option.key
    //   ? Styles.cardSelectedBackground
    //   : Styles.cardRegularBackground;
    const costLabel = isPremium ? `${cost} Ameelio+` : `${cost} free Ameelio`;

    return (
      <TouchableOpacity
        style={[
          CardStyles.shadow,
          CardStyles.selectPostcardSizeBase,
          CardStyles.horizontalCardLayout,
          { height: 140 },
        ]}
        onPress={() => setSelected(option)}
      >
        <AsyncImage
          imageStyle={{ flex: 1, height: '100%', resizeMode: 'cover' }}
          download
          source={image}
          autorotate={false}
          local
        />
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={[Typography.FONT_BOLD]}>{title}</Text>
          <Text style={Styles.body}>
            {wordsLimit} {i18n.t('Compose.words')}
          </Text>
          <View>
            <Text style={[Styles.body, { marginTop: 'auto' }]}>
              {costLabel}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={Styles.trueBackground}>
      {POSTCARD_SIZE_OPTIONS.map((option) => renderItem(option))}
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  draft: state.mail.composing,
});

const mapDispatchToProps = (dispatch: Dispatch<MailActionTypes>) => ({
  updateDraft: (draft: Draft) => dispatch(setComposing(draft)),
});

const SelectPostcardSizeScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectPostcardSizeBase);

export default SelectPostcardSizeScreen;
