import React, { ReactElement } from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';

interface Props {
  height?: number;
  width?: number;
}

const ContactCardPlaceholder = ({ height, width }: Props): ReactElement => {
  return (
    <ContentLoader
      height={height}
      width={width}
      backgroundColor="#f3f3f3"
      foregroundColor="#dbdbdb"
    >
      <Rect x={40} y={8} rx="3" ry="3" width="80" height="8" />
      <Rect x={40} y={24} rx="3" ry="3" width="80" height="8" />
      <Rect x={40} y={40} rx="3" ry="3" width="80" height="8" />
    </ContentLoader>
  );
};

ContactCardPlaceholder.defaultProps = {
  height: 54,
  width: 160,
};

export default ContactCardPlaceholder;
