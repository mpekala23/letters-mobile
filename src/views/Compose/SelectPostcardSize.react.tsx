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
  const [selected, setSelected] = useState<PostcardSizeOption>(
    (draft as DraftPostcard).size
  );

  const updatePostcardOption = async () => {
    updateDraft({ ...draft, size: selected } as DraftPostcard);
    navigation.navigate(Screens.ComposePostcard, {
      category: route.params.category,
    });
  };

  useEffect(() => {
    setProfileOverride({
      enabled: !!selected,
      text: i18n.t('Compose.selectBtn'),
      action: updatePostcardOption,
      blocking: true,
    });
    return () => {
      setProfileOverride(undefined);
    };
  });

  const renderItem = (option: PostcardSizeOption) => {
    const { image, title, wordsLimit, cost, isPremium } = option;
    const borderStyle =
      selected.key === option.key ? CardStyles.cardSelectedBackground : {};
    const costLabel = isPremium ? `${cost} Ameelio+` : `${cost} free Ameelio`;

    return (
      <TouchableOpacity
        style={[
          CardStyles.shadow,
          CardStyles.selectPostcardSizeBase,
          CardStyles.horizontalCardLayout,
          borderStyle,
          { height: 140 },
        ]}
        onPress={() => setSelected(option)}
        key={option.key}
      >
        <AsyncImage
          imageStyle={{
            height: '100%',
            width: '60%',
            resizeMode: 'cover',
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
          }}
          download
          source={image}
          autorotate={false}
          local
        />
        <View style={{ marginLeft: 16, width: '40%' }}>
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
