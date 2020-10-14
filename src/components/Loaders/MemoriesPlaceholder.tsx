import React, { ReactElement } from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';

interface Props {
  height?: number;
  width?: number;
}

const MemoriesPlaceholder = ({ height, width }: Props): ReactElement => (
  <ContentLoader
    viewBox="0 0 400 400"
    height={height}
    width={width}
    foregroundColor="#dbdbdb"
  >
    <Rect x="30" y="45" rx="3" ry="3" width="150" height="210" />
    <Rect x="200" y="45" rx="3" ry="3" width="150" height="210" />
    <Rect x="30" y="220" rx="3" ry="3" width="150" height="210" />
    <Rect x="200" y="220" rx="3" ry="3" width="150" height="210" />
  </ContentLoader>
);

MemoriesPlaceholder.defaultProps = {
  height: 400,
  width: 400,
};

export default MemoriesPlaceholder;
