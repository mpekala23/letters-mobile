import React from 'react';
import i18n from '@i18n';
import { Colors, Typography } from '@styles';
import {
  BOTTOM_HEIGHT,
  PERSONAL_OVERRIDE_ID,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from '@utils/Constants';
import {
  Animated,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image as ImageComponent,
} from 'react-native';
import {
  DesignBottomDetails,
  Image,
  Layout,
  PersonalDesign,
  Sticker,
} from 'types';
import { takeImage } from '@utils';
import { LAYOUTS } from '@utils/Layouts';
import STICKERS from '@assets/stickers';
import Loading from '@assets/common/loading.gif';
import * as Segment from 'expo-analytics-segment';
import Icon from '../../Icon/Icon.react';
import AsyncImage from '../../AsyncImage/AsyncImage.react';
import { dropdownError } from '../../Dropdown/Dropdown.react';
import Styles from './DesignBottom.styles';

interface Props {
  bottomSlide: Animated.Value;
  details: DesignBottomDetails | null;
  onClose: () => void;
  onLayoutSelected: (layout: Layout) => void;
  onStickerSelected: (sticker: Sticker) => void;
  library: Image[];
  onDesignSelected: (design: PersonalDesign) => void;
  loadMoreImages: () => void;
}

function LayoutSelector({
  onLayoutSelected,
}: {
  onLayoutSelected: (layout: Layout) => void;
}): JSX.Element {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        paddingTop: 4,
      }}
    >
      <Text style={[Typography.FONT_REGULAR, { color: 'white', fontSize: 18 }]}>
        {i18n.t('Compose.layouts')}
      </Text>
      <FlatList
        data={LAYOUTS}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={{
                width: (WINDOW_WIDTH - 32) / 2,
                height: WINDOW_HEIGHT * 0.2 - 16,
                margin: 4,
              }}
              onPress={() => onLayoutSelected(item)}
            >
              <Icon svg={item.svg} />
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item: Layout) => {
          return item.id.toString();
        }}
        numColumns={2}
        contentContainerStyle={Styles.gridBackground}
      />
    </View>
  );
}

function StickerSelector({
  onStickerSelected,
}: {
  onStickerSelected: (sticker: Sticker) => void;
}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        paddingTop: 4,
      }}
    >
      <Text style={[Typography.FONT_REGULAR, { color: 'white', fontSize: 18 }]}>
        {i18n.t('Compose.stickers')}
      </Text>
      <FlatList
        data={STICKERS}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={{
                width: (WINDOW_WIDTH - 64) / 3,
                height: WINDOW_HEIGHT * 0.2 - 16,
                margin: 4,
                borderRadius: 8,
              }}
              onPress={() => onStickerSelected(item)}
            >
              <ImageComponent
                source={item.image}
                style={{ width: '100%', height: '100%' }}
              />
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item: Sticker) => {
          return item.name;
        }}
        numColumns={3}
        contentContainerStyle={Styles.gridBackground}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function DesignSelector({
  library,
  onDesignSelected,
  loadMoreImages,
}: {
  library: Image[];
  onDesignSelected: (design: PersonalDesign) => void;
  loadMoreImages: () => void;
}) {
  return (
    <>
      <View style={[Styles.subcategorySelectorBackground, { marginTop: 16 }]}>
        <TouchableOpacity
          style={[
            Styles.subcategory,
            {
              borderBottomColor: 'white',
            },
          ]}
          onPress={async () => {
            Segment.trackWithProperties(
              'Compose - Click on Subcategory Option',
              { subcategory: 'Library' }
            );
          }}
          key="Library"
        >
          <Text
            style={[
              Typography.FONT_MEDIUM,
              Styles.subcategoryText,
              {
                color: 'white',
              },
            ]}
          >
            {i18n.t('Compose.library')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            Styles.subcategory,
            {
              borderBottomColor: '#505050',
            },
          ]}
          onPress={async () => {
            Segment.trackWithProperties(
              'Compose - Click on Subcategory Option',
              { subcategory: 'Take photo' }
            );

            try {
              const image = await takeImage({
                aspect: [6, 4],
                allowsEditing: true,
              });
              if (image) {
                onDesignSelected({
                  asset: image,
                  type: 'personal_design',
                  categoryId: PERSONAL_OVERRIDE_ID,
                });
              }
            } catch (err) {
              dropdownError({ message: i18n.t('Permission.camera') });
            }
          }}
          key="Take photo"
        >
          <Text
            style={[
              Typography.FONT_MEDIUM,
              Styles.subcategoryText,
              {
                color: Colors.GRAY_500,
              },
            ]}
          >
            {i18n.t('Compose.takePhoto')}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={library}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={{
                width: (WINDOW_WIDTH - 32) / 3,
                height: (WINDOW_WIDTH - 32) / 3,
                margin: 4,
              }}
              onPress={() => {
                onDesignSelected({
                  asset: item,
                  type: 'personal_design',
                  categoryId: PERSONAL_OVERRIDE_ID,
                });
              }}
            >
              <AsyncImage
                source={item}
                imageStyle={{ flex: 1, aspectRatio: 1 }}
                autorotate={false}
              />
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index: number) => {
          return `${item.uri} ${index.toString()}`;
        }}
        numColumns={3}
        contentContainerStyle={Styles.gridBackground}
        onEndReached={loadMoreImages}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                flex: 1,
                height: 300,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ImageComponent
                style={{ width: 40, height: 40 }}
                source={Loading}
              />
            </View>
          );
        }}
      />
    </>
  );
}

const DesignBottom: React.FC<Props> = ({
  bottomSlide,
  details,
  onClose,
  onLayoutSelected,
  onStickerSelected,
  library,
  onDesignSelected,
  loadMoreImages,
}: Props) => {
  let content;
  if (details === 'layout') {
    content = <LayoutSelector onLayoutSelected={onLayoutSelected} />;
  } else if (details === 'stickers') {
    content = <StickerSelector onStickerSelected={onStickerSelected} />;
  } else {
    content = (
      <DesignSelector
        library={library}
        loadMoreImages={loadMoreImages}
        onDesignSelected={onDesignSelected}
      />
    );
  }

  return (
    <Animated.View
      style={[
        Styles.bottom,
        {
          bottom: bottomSlide.interpolate({
            inputRange: [0, 1],
            outputRange: [-BOTTOM_HEIGHT, 0],
          }),
        },
      ]}
    >
      {content}
      <TouchableOpacity
        style={{ position: 'absolute', top: 4, right: 8 }}
        onPress={onClose}
      >
        <Text
          style={[
            Typography.FONT_REGULAR,
            {
              color: 'white',
              fontSize: 18,
            },
          ]}
        >
          {i18n.t('Compose.done')}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default DesignBottom;
