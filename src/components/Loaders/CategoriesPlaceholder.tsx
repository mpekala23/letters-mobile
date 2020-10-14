import React, { ReactElement } from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';

interface Props {
  height?: number;
  width?: number;
}

const CategoriesPlaceholder = ({ height, width }: Props): ReactElement => (
  <ContentLoader
    viewBox="0 0 400 400"
    height={height}
    width={width}
    foregroundColor="#dbdbdb"
  >
    <Rect x="30" y="45" rx="0" ry="0" width="300" height="100" />
    <Rect x="30" y="160" rx="0" ry="0" width="140" height="100" />
    <Rect x="185" y="160" rx="0" ry="0" width="140" height="100" />
    <Rect x="30" y="270" rx="0" ry="0" width="140" height="100" />
    <Rect x="185" y="270" rx="0" ry="0" width="140" height="100" />
  </ContentLoader>
);

CategoriesPlaceholder.defaultProps = {
  height: 400,
  width: 400,
};

export default CategoriesPlaceholder;
