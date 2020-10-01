import React, { ReactElement } from 'react';
import { View, ViewStyle } from 'react-native';
import AdjustableText from '@components/Text/AdjustableText.react';
import { Contact } from 'types';
import { Typography } from '@styles';

interface Props {
  recipient: Contact;
  style?: ViewStyle | ViewStyle[];
}

const MailingAddressPreview = ({ recipient, style }: Props): ReactElement => {
  return (
    <View style={style}>
      <AdjustableText
        style={[Typography.FONT_REGULAR, { fontSize: 14 }]}
        numberOfLines={4}
      >
        {recipient.firstName} {recipient.lastName}, {recipient.inmateNumber}{' '}
        {'\n'}
        {recipient.facility.name}
        {'\n'}
        {recipient.facility?.address}
        {'\n'}
        {recipient.facility?.city}, {recipient.facility?.state}{' '}
        {recipient.facility?.postal}
      </AdjustableText>
    </View>
  );
};

MailingAddressPreview.defaultProps = {
  style: {},
};

export default MailingAddressPreview;
