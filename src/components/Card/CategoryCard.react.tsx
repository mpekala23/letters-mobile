import React from 'react';
import { Text, TouchableOpacity, ViewStyle, View } from 'react-native';
import { Category } from 'types';
import { Typography, Colors } from '@styles';
import AsyncImage from '@components/AsyncImage/AsyncImage.react';
import { capitalize } from '@utils';
import CardStyles from './Card.styles';

interface Props {
  category: Category;
  style?: ViewStyle;
  navigate: (path: string, params?: Record<string, unknown>) => void;
}

const CategoryCard: React.FC<Props> = (props: Props) => {
  return (
    <View style={{ width: '100%', padding: 8 }}>
      <TouchableOpacity
        style={[
          CardStyles.cardBase,
          CardStyles.categoryBackground,
          CardStyles.shadow,
          props.style,
        ]}
        onPress={() => {
          if (props.category.name === 'personal') {
            props.navigate('ChooseOption');
            return;
          }
          props.navigate('ComposePostcard', { category: props.category });
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
        <View style={{ flex: 1, padding: 8, justifyContent: 'center' }}>
          <Text style={[Typography.FONT_BOLD, CardStyles.categoryTitle]}>
            {capitalize(props.category.name)}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

CategoryCard.defaultProps = {
  style: {},
};

export default CategoryCard;
