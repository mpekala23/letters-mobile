import React from 'react';
import { View, Text } from 'react-native';
import { Colors, Typography } from '@styles';
import { LetterTrackingEvent, LetterStatus } from 'types';
import moment from 'moment';

export interface Props {
  trackingEvent: LetterTrackingEvent;
}

function mapStatustoTrackerColor(type: string) {
  switch (type) {
    case LetterStatus.Mailed:
      return '#436697';
    case LetterStatus.InTransit:
      return '#6D89B1';
    case LetterStatus.InLocalArea:
      return '#8DA7CC';
    case LetterStatus.OutForDelivery:
      return '#A8C1E4';
    default:
      return '';
  }
}

const LetterTracker: React.FC<Props> = (props: Props) => {
  const event = props.trackingEvent;
  const date = moment(event.date).format('MMM DD, YYYY');
  const time = moment(event.date).format('HH:mm a');

  return (
    <View>
      <View style={{ flexDirection: 'row', paddingBottom: 16 }}>
        <View
          style={{
            borderRadius: 50,
            backgroundColor: mapStatustoTrackerColor(event.name),
            height: 36,
            width: 36,
            marginRight: 24,
          }}
        />
        <View style={{ flexDirection: 'column' }}>
          <Text
            style={[
              Typography.FONT_BOLD,
              {
                color: Colors.AMEELIO_BLACK,
                fontSize: 16,
                paddingBottom: 6,
              },
            ]}
          >
            {event.name}
          </Text>
          <Text
            style={[
              Typography.FONT_BOLD,
              {
                color: Colors.GRAY_DARKER,
                fontSize: 14,
                paddingBottom: 4,
              },
            ]}
          >
            {event.location}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            marginLeft: 'auto',
            alignItems: 'flex-end',
          }}
        >
          <Text
            style={[
              Typography.FONT_REGULAR,
              {
                color: Colors.GRAY_DARKER,
                fontSize: 14,
                paddingBottom: 8,
              },
            ]}
          >
            {date}
          </Text>
          <Text
            style={[
              Typography.FONT_REGULAR,
              {
                color: Colors.GRAY_DARKER,
                fontSize: 14,
                paddingBottom: 4,
              },
            ]}
          >
            {time}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LetterTracker;
