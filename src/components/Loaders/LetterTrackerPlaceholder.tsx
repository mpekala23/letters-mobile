import React, { ReactElement } from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';

interface Props {
  height?: number;
  width?: number;
}

const LetterTrackerPlaceholder = ({ height, width }: Props): ReactElement => {
  return (
    <ContentLoader
      height={height}
      width={width}
      viewBox="0 0 320 54"
      backgroundColor="#f3f3f3"
      foregroundColor="#dbdbdb"
    >
      <Rect rx="3" ry="3" width="10" height="100" />
      <Rect x="53" y="14" rx="3" ry="3" width="180" height="13" />
      <Rect x="300" y="14" rx="3" ry="3" width="20" height="10" />
      <Rect x="53" y="30" rx="3" ry="3" width="74" height="10" />
      <Rect x="0" y="53" rx="0" ry="0" width="320" height="1" />
      <Rect x="219" y="146" rx="0" ry="0" width="0" height="0" />
    </ContentLoader>
  );
};

LetterTrackerPlaceholder.defaultProps = {
  height: 54,
  width: 320,
};

export default LetterTrackerPlaceholder;
