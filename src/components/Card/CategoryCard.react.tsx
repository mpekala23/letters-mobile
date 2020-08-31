import React, { Dispatch } from 'react';
import { Text, TouchableOpacity, ViewStyle, View } from 'react-native';
import { Category, Draft, MailTypes } from 'types';
import { Typography, Colors } from '@styles';
import AsyncImage from '@components/AsyncImage/AsyncImage.react';
import { capitalize } from '@utils';
import { setComposing } from '@store/Mail/MailActions';
import { connect } from 'react-redux';
import { MailActionTypes } from '@store/Mail/MailTypes';
import { AppState } from '@store/types';
import * as Segment from 'expo-analytics-segment';
import CardStyles from './Card.styles';

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
            props.navigate('ChooseOption');
          } else {
            props.setComposing({
              type: MailTypes.Postcard,
              content: '',
              recipientId: props.recipientId,
              design: {
                image: { uri: '' },
              },
            });
            props.navigate('ComposePostcard', { category: props.category });
          }
        }}
      >
        <AsyncImage
          download
          source={props.category.image}
          viewStyle={{
            width: '100%',
            height: 132,
            backgroundColor: Colors.GRAY_MEDIUM,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            overflow: 'hidden',
          }}
        />
        <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
          <Text style={[Typography.FONT_SEMIBOLD, CardStyles.categoryTitle]}>
            {capitalize(props.category.name)}
          </Text>
          <Text style={[Typography.FONT_REGULAR, CardStyles.categoryBlurb]}>
            {props.category.blurb}
          </Text>
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
