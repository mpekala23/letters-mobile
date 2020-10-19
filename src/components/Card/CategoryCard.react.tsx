import React, { Dispatch } from 'react';
import { TouchableOpacity, ViewStyle, View } from 'react-native';
import { Category, Draft, MailTypes } from 'types';
import { Typography, Colors } from '@styles';
import AsyncImage from '@components/AsyncImage/AsyncImage.react';
import { capitalize } from '@utils';
import { setComposing } from '@store/Mail/MailActions';
import { connect } from 'react-redux';
import { MailActionTypes } from '@store/Mail/MailTypes';
import { AppState } from '@store/types';
import * as Segment from 'expo-analytics-segment';
import { Screens } from '@utils/Screens';
import CardStyles from './Card.styles';
import AdjustableText from '../Text/AdjustableText.react';

interface Props {
  category: Category;
  style?: ViewStyle;
  navigate: (path: string, params?: Record<string, unknown>) => void;
  setComposing: (draft: Draft) => void;
  recipientId: number;
}

const CategoryCardBase: React.FC<Props> = (props: Props) => {
  return (
    <View style={{ flex: 1, padding: 8 }}>
      <TouchableOpacity
        style={[
          CardStyles.cardBase,
          CardStyles.categoryBackground,
          CardStyles.shadow,
          props.style,
        ]}
        onPress={() => {
          Segment.trackWithProperties('Compose - Click on Category Option', {
            category: props.category.name,
          });
          if (props.category.name === 'personal') {
            props.navigate(Screens.ChooseOption);
          } else {
            props.setComposing({
              type: MailTypes.Postcard,
              content: '',
              recipientId: props.recipientId,
              design: {
                image: { uri: '' },
              },
            });
            props.navigate(Screens.ComposePostcard, {
              category: props.category,
            });
          }
        }}
      >
        <AsyncImage
          download
          source={props.category.image}
          autorotate={false}
          viewStyle={{
            width: '100%',
            height: 132,
            backgroundColor: Colors.GRAY_300,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            overflow: 'hidden',
          }}
        />
        <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
          <AdjustableText
            style={[Typography.FONT_SEMIBOLD, CardStyles.categoryTitle]}
            numberOfLines={1}
          >
            {capitalize(props.category.name)}
          </AdjustableText>
          <AdjustableText
            style={[Typography.FONT_REGULAR, CardStyles.categoryBlurb]}
            numberOfLines={1}
          >
            {props.category.blurb}
          </AdjustableText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

CategoryCardBase.defaultProps = {
  style: {},
};

const mapStateToProps = (state: AppState) => ({
  recipientId: state.mail.composing.recipientId,
});

const mapDispatchToProps = (dispatch: Dispatch<MailActionTypes>) => ({
  setComposing: (draft: Draft) => dispatch(setComposing(draft)),
});

const CategoryCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryCardBase);

export default CategoryCard;
