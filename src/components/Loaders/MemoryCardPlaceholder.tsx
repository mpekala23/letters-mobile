import React, { ReactElement } from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';

interface Props {
  height?: number;
  width?: number;
}

const MemoryCardPlaceholder = ({ height, width }: Props): ReactElement => {
  return (
    <ContentLoader
      height={height}
      width={width}
      viewBox="0 0 320 54"
      backgroundColor="#f3f3f3"
      foregroundColor="#dbdbdb"
    >
      <Rect x="" y="14" rx="3" ry="3" width="50" height="26" />
      <Rect x="219" y="146" rx="0" ry="0" width="0" height="0" />
    </ContentLoader>
  );
};

MemoryCardPlaceholder.defaultProps = {
  height: 54,
  width: 320,
};

export default MemoryCardPlaceholder;
