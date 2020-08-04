import React from 'react';
import { View, Text } from 'react-native';
import { Colors, Typography } from '@styles';
import { LetterTrackingEvent, LetterStatus } from 'types';
import { format } from 'date-fns';

export interface Props {
  trackingEvent: LetterTrackingEvent;
}

function mapStatustoTrackerColor(type: string) {
  switch (type) {
    case LetterStatus.Mailed:
      return Colors.GREEN_LIGHTER;
    case LetterStatus.InTransit:
      return Colors.GREEN_LIGHT;
    case LetterStatus.ProcessedForDelivery:
      return Colors.GREEN_DARK;
    case LetterStatus.Delivered:
      return Colors.GREEN_DARKER;
    default:
      return '';
  }
}

const LetterTracker: React.FC<Props> = (props: Props) => {
  const { name, location, date } = props.trackingEvent;
  const dateFormatted = date ? format(date, 'MMM dd, yyyy') : '';
  const timeFormatted =
    name !== LetterStatus.Delivered ? format(date, 'h:mm a') : '';

  if (
    name === LetterStatus.Mailed ||
    name === LetterStatus.InTransit ||
    name === LetterStatus.ProcessedForDelivery ||
    name === LetterStatus.Delivered
  ) {
    return (
      <View>
        <View style={{ flexDirection: 'row', paddingBottom: 16 }}>
          <View
            style={{
              borderRadius: 50,
              backgroundColor: mapStatustoTrackerColor(name),
              height: 28,
              width: 28,
              marginLeft: 4,
              marginRight: 24,
            }}
            testID="trackerCircle"
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
              {name}
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
              {location ? location.city : ''}
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
              testID="dateFormatted"
            >
              {dateFormatted}
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
              {timeFormatted}
            </Text>
          </View>
        </View>
      </View>
    );
  }
  return null;
};

export default LetterTracker;
