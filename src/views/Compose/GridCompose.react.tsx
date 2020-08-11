import React from 'react';
import { Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import { GenericCard } from '@components';
import { PostcardDesign } from 'types';
import { Typography } from '@styles';
import { WINDOW_WIDTH } from '@utils';
import Styles from './Compose.styles';

const EXAMPLE_DATA: Record<string, PostcardDesign[]> = {
  'Prison Art': [
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
    {
      image: {
        uri:
          'https://i.pinimg.com/originals/cc/18/8c/cc188c604e58cffd36e1d183c7198d21.jpg',
      },
    },
  ],
  Scenery: [
    {
      image: {
        uri:
          'https://s3.amazonaws.com/thumbnails.thecrimson.com/photos/2018/07/07/110709_1331528.jpg.1500x1000_q95_crop-smart_upscale.jpg',
      },
    },
  ],
};

interface Props {
  data: Record<string, PostcardDesign[]>;
  initialSubcategory: string;
}

interface State {
  subcategory: string;
  design: PostcardDesign;
}

export default class GridCompose extends React.Component<Props, State> {
  static defaultProps = {
    data: EXAMPLE_DATA,
    initialSubcategory: 'Prison Art',
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      subcategory: props.initialSubcategory,
      design: props.data[props.initialSubcategory][0],
    };
    this.renderSubcategorySelector = this.renderSubcategorySelector.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  renderSubcategorySelector(): JSX.Element {
    const subcategories = Object.keys(this.props.data);
    return (
      <View style={Styles.subcategorySelectorBackground}>
        {subcategories.map((subcategory) => (
          <TouchableOpacity
            style={[
              Styles.subcategory,
              {
                borderBottomColor:
                  subcategory === this.state.subcategory ? 'white' : '#505050',
              },
            ]}
            onPress={() => this.setState({ subcategory })}
            key={subcategory}
          >
            <Text style={[Typography.FONT_MEDIUM, Styles.subcategoryText]}>
              {subcategory}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  renderItem(design: PostcardDesign): JSX.Element {
    return (
      <TouchableOpacity
        style={{ width: (WINDOW_WIDTH - 32) / 3, margin: 4 }}
        onPress={() => this.setState({ design })}
      >
        <Image
          style={{ aspectRatio: 1, overflow: 'hidden' }}
          source={design.image}
        />
      </TouchableOpacity>
    );
  }

  render(): JSX.Element {
    return (
      <View style={Styles.gridTrueBackground}>
        <View style={Styles.gridPreviewBackground}>
          <GenericCard style={{ flex: 1, padding: 0, overflow: 'hidden' }}>
            <Image style={{ flex: 1 }} source={this.state.design.image} />
          </GenericCard>
        </View>
        <View style={Styles.gridOptionsBackground}>
          {this.renderSubcategorySelector()}
          <FlatList
            data={EXAMPLE_DATA[this.state.subcategory]}
            renderItem={({ item }) => this.renderItem(item)}
            keyExtractor={(item: PostcardDesign, index: number) => {
              return item.image.uri + index.toString();
            }}
            numColumns={3}
            contentContainerStyle={Styles.gridBackground}
          />
        </View>
      </View>
    );
  }
}
