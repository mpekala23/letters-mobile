import React from 'react';
import { View, Image as ImageComponent } from 'react-native';
import { Image } from 'types';
import Styles, { HEIGHT_LETTER, WIDTH_POSTCARD } from './DisplayImage.styles';

export interface Props {
  images: Image[];
  isPostcard?: boolean;
  heightLetter?: number;
}

const getAspectRatio = (image: Image): number => {
  return image.width && image.height ? image.width / image.height : 1;
};

const DisplayImage: React.FC<Props> = (props: Props) => {
  const { images, isPostcard, heightLetter } = props;

  if (!images.length) return null;

  if (isPostcard) {
    const aspectRatio = getAspectRatio(images[0]);
    return (
      <ImageComponent
        style={[
          Styles.postcardImage,
          {
            height:
              aspectRatio > 1 ? WIDTH_POSTCARD / aspectRatio : WIDTH_POSTCARD,
            width:
              aspectRatio > 1 ? WIDTH_POSTCARD : WIDTH_POSTCARD * aspectRatio,
          },
        ]}
        source={images[0]}
      />
    );
  }

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {images.map((image) => (
        <ImageComponent
          key={image.uri}
          style={[
            Styles.letterImage,
            {
              height: heightLetter,
              width: heightLetter
                ? heightLetter * getAspectRatio(image)
                : heightLetter,
            },
          ]}
          source={image}
        />
      ))}
    </View>
  );
};

DisplayImage.defaultProps = {
  images: [],
  isPostcard: false,
  heightLetter: HEIGHT_LETTER,
};

export default DisplayImage;
