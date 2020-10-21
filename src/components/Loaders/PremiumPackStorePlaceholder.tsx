import React, { ReactElement } from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';

interface Props {
  height?: number;
  width?: number;
}

const PremiumPackStorePlaceholder = ({
  height,
  width,
}: Props): ReactElement => (
  <ContentLoader
    viewBox="0 0 400 400"
    height={height}
    width={width}
    foregroundColor="#dbdbdb"
  >
    <Rect y="45" rx="0" ry="0" width="325" height="75" />
    <Rect y="140" rx="0" ry="0" width="325" height="75" />
    <Rect y="240" rx="0" ry="0" width="325" height="75" />
  </ContentLoader>
);

PremiumPackStorePlaceholder.defaultProps = {
  height: 400,
  width: 400,
};

export default PremiumPackStorePlaceholder;
