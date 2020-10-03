import React from 'react';
import { View, Text, Image as ImageComponent } from 'react-native';
import { Colors, Typography } from '@styles';
import { TrackingEvent, MailStatus } from 'types';
import { format } from 'date-fns';
import { estimateDelivery } from '@utils';
import Loading from '@assets/common/loading.gif';

export interface Props {
  trackingEvent?: TrackingEvent;
  type: MailStatus;
}

function LetterTracker({ trackingEvent, type }: Props): React.ReactElement {
  const mapStatustoTrackerColor = (): string => {
    if (!trackingEvent) return Colors.AMEELIO_WHITE;
    switch (type) {
      case MailStatus.Created:
        return Colors.BLUE_100;
      case MailStatus.Mailed:
        return Colors.BLUE_200;
      case MailStatus.InTransit:
        return Colors.BLUE_300;
      case MailStatus.ProcessedForDelivery:
        return Colors.BLUE_400;
      case MailStatus.Delivered:
        return Colors.BLUE_500;
      default:
        return '';
    }
  };

  const mapStatusToBorderColor = (): string => {
    switch (type) {
      case MailStatus.Created:
        return Colors.BLUE_100;
      case MailStatus.Mailed:
        return Colors.BLUE_200;
      case MailStatus.InTransit:
        return Colors.BLUE_300;
      case MailStatus.ProcessedForDelivery:
        return Colors.BLUE_400;
      case MailStatus.Delivered:
        return Colors.BLUE_500;
      default:
        return '';
    }
  };

  const genDate = (): string => {
    if (!trackingEvent) return '';
    return type === MailStatus.Delivered
      ? format(
          estimateDelivery(trackingEvent.date, MailStatus.ProcessedForDelivery),
          'MMM dd, yyyy'
        )
      : format(trackingEvent.date, 'MMM dd, yyyy');
  };

  const genTimestamp = (): string => {
    return trackingEvent && type !== MailStatus.Delivered
      ? format(trackingEvent.date, 'h:mm a')
      : '';
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      {trackingEvent ? (
        <>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-end',
              marginRight: 16,
              width: 112,
            }}
          >
            <Text
              style={[
                Typography.FONT_SEMIBOLD,
                {
                  fontSize: 16,
                  paddingBottom: 8,
                },
              ]}
              testID="dateFormatted"
            >
              {genDate()}
            </Text>
            <Text
              style={[
                Typography.FONT_REGULAR,
                {
                  color: Colors.GRAY_DARKER,
                  fontSize: 16,
                },
              ]}
            >
              {genTimestamp()}
            </Text>
          </View>
        </>
      ) : (
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-end',
            marginRight: 16,
            width: 112,
          }}
        />
      )}
      <View>
        <View
          style={{
            borderRadius: 50,
            backgroundColor: mapStatustoTrackerColor(),
            borderColor: mapStatusToBorderColor(),
            borderWidth: 2,
            height: 28,
            width: 28,
            marginLeft: 4,
            marginRight: 24,
          }}
          testID="trackerCircle"
        />
        {type !== MailStatus.Delivered && (
          <View
            style={{
              marginLeft: 14,
              height: 40,
              width: 7,
              backgroundColor: Colors.BLACK_200,
            }}
          />
        )}
      </View>

      <View style={{ flexDirection: 'column', width: 128 }}>
        <Text
          style={[
            Typography.FONT_SEMIBOLD,
            {
              color: Colors.AMEELIO_BLACK,
              fontSize: 16,
              paddingBottom: 8,
            },
          ]}
        >
          {type}
        </Text>
        <Text
          style={[
            {
              color: Colors.GRAY_DARKER,
              fontSize: 14,
              paddingBottom: 4,
            },
          ]}
        >
          {trackingEvent?.location ? trackingEvent.location.city : ''}
        </Text>
      </View>
    </View>
  );
}

export default LetterTracker;
