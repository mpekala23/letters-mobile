import React from 'react';
import {
  Text,
  TouchableOpacity,
  ViewStyle,
  Image as ImageComponent,
  View,
} from 'react-native';
import { Category } from 'types';
import { Typography } from '@styles';
import { navigate } from '@navigations';
import CardStyles from './Card.styles';

interface Props {
  category: Category;
  style?: ViewStyle;
}

const CategoryCard: React.FC<Props> = (props: Props) => {
  return (
    <TouchableOpacity
      style={[
        CardStyles.cardBase,
        CardStyles.categoryBackground,
        CardStyles.shadow,
        props.style,
      ]}
      onPress={() => {
        if (props.category.name === 'personal') {
          navigate('ChooseOption');
          return;
        }
        navigate('ComposePostcard', { category: props.category });
      }}
    >
      <ImageComponent
        source={props.category.image}
        style={{ width: '100%', height: 132 }}
      />
      <View style={{ flex: 1, padding: 8, justifyContent: 'center' }}>
        <Text style={[Typography.FONT_BOLD, CardStyles.categoryTitle]}>
          {props.category.name.slice(0, 1).toUpperCase() +
            props.category.name.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

CategoryCard.defaultProps = {
  style: {},
};

export default CategoryCard;
