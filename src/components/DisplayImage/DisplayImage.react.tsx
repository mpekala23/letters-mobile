import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Image } from 'types';
import { getAspectRatio, getImageDims } from '@utils';
import { Colors } from '@styles';
import Styles, { HEIGHT_LETTER, WIDTH_POSTCARD } from './DisplayImage.styles';
import AsyncImage from '../AsyncImage/AsyncImage.react';

export interface Props {
  images: Image[];
  isPostcard?: boolean;
  heightLetter?: number;
  paddingPostcard?: number; // additional padding to decrease width
  updateImages?: (images: Image[]) => void;
  local?: boolean;
  backgroundColor?: string;
}

const DisplayImage: React.FC<Props> = ({
  images,
  isPostcard,
  heightLetter,
  paddingPostcard,
  updateImages,
  local,
  backgroundColor,
}: Props) => {
  if (!images.length) return null;

  const [sizedImages, setSizedImages] = useState(images);

  useEffect(() => {
    let changed = false;
    Promise.all(
      images.map(async (image) => {
        if (image.width && image.height) return image;
        changed = true;
        const dims = await getImageDims(image.uri);
        return {
          uri: image.uri,
          ...dims,
        };
      })
    ).then((newImages) => {
      setSizedImages(newImages);
      if (changed && updateImages) {
        updateImages(newImages);
      }
    });
  }, [images]);

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {sizedImages.map((image) => {
        const aspectRatio = getAspectRatio(image);
        const padding = paddingPostcard ? 2 * paddingPostcard : 0;
        let height = heightLetter || HEIGHT_LETTER;
        let width = height * aspectRatio;
        if (isPostcard) {
          height =
            aspectRatio > 1
              ? (WIDTH_POSTCARD - padding) / aspectRatio
              : WIDTH_POSTCARD;
          width =
            aspectRatio > 1
              ? WIDTH_POSTCARD - padding
              : WIDTH_POSTCARD * aspectRatio;
        }
        return (
          <AsyncImage
            key={image.uri}
            viewStyle={[
              isPostcard ? Styles.postcardImage : Styles.letterImage,
              {
                height,
                width,
              },
            ]}
            loadingBackgroundColor={backgroundColor || Colors.GRAY_100}
            download={!local}
            autorotate={false}
            local={!!local}
            source={image}
          />
        );
      })}
    </View>
  );
};

DisplayImage.defaultProps = {
  images: [],
  isPostcard: false,
};

export default DisplayImage;
