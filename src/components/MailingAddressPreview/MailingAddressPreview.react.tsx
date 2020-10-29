import React, { ReactElement } from 'react';
import { View, ViewStyle } from 'react-native';
import AdjustableText from '@components/Text/AdjustableText.react';
import { Contact, ContactDraft } from 'types';
import { Typography } from '@styles';

interface Props {
  recipient: Contact | ContactDraft;
  style?: ViewStyle | ViewStyle[];
}

const MailingAddressPreview = ({ recipient, style }: Props): ReactElement => {
  const unitInfo = recipient.unit ? `, ${recipient.unit}` : '';
  const dormInfo = recipient.dorm ? `, ${recipient.dorm}` : '';
  return (
    <View style={style}>
      <AdjustableText
        style={[Typography.FONT_REGULAR, { fontSize: 14 }]}
        numberOfLines={5}
      >
        To: {recipient.firstName} {recipient.lastName}, {recipient.inmateNumber}{' '}
        {'\n'}
        {recipient.facility.name}
        {unitInfo}
        {dormInfo}
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
