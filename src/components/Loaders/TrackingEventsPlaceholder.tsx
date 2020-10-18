import React, { ReactElement } from 'react';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

interface Props {
  height?: number;
  width?: number;
}

const TrackingEventsPlaceholder = ({ height, width }: Props): ReactElement => (
  <ContentLoader height={height} width={width} foregroundColor="#dbdbdb">
    <Rect x="0" y="12" rx="3" ry="3" width="80" height="7" />
    <Rect x="213" y="12" rx="3" ry="3" width="80" height="7" />
    <Rect x="0" y="140" rx="3" ry="3" width="80" height="6" />
    <Rect x="213" y="140" rx="3" ry="3" width="80" height="6" />
    <Circle cx="150" cy="24" r="18" />
    <Circle cx="150" cy="124" r="18" />
    <Circle cx="150" cy="232" r="18" />
    <Rect x="0" y="117" rx="3" ry="3" width="80" height="7" />
    <Rect x="213" y="117" rx="3" ry="3" width="80" height="7" />
    <Rect x="0" y="222" rx="3" ry="3" width="80" height="7" />
    <Rect x="213" y="222" rx="3" ry="3" width="80" height="7" />
    <Rect x="0" y="36" rx="3" ry="3" width="80" height="6" />
    <Rect x="213" y="36" rx="3" ry="3" width="80" height="6" />
    <Rect x="0" y="245" rx="3" ry="3" width="80" height="6" />
    <Rect x="213" y="245" rx="3" ry="3" width="80" height="6" />
    <Rect x="146" y="42" rx="3" ry="3" width="8" height="65" />
    <Rect x="146" y="144" rx="3" ry="3" width="8" height="65" />
  </ContentLoader>
);

TrackingEventsPlaceholder.defaultProps = {
  height: 600,
  width: 530,
};

export default TrackingEventsPlaceholder;
