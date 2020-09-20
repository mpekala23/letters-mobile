import { FamilyConnection, ProfilePicTypes } from 'types';
import React, { ReactElement } from 'react';
import { View, Text } from 'react-native';
import Facepile from '@components/Image/Facepile';

interface Props {
  familyConnection: FamilyConnection;
}

const ReferralConnectionCard = ({ familyConnection }: Props): ReactElement => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <View>
        <Facepile
          people={[
            {
              image: familyConnection.userImage,
              firstName: familyConnection.userName,
              lastName: '',
            },
            {
              image: familyConnection.contactImage,
              firstName: familyConnection.contactName,
              lastName: '',
            },
          ]}
          type={ProfilePicTypes.ReferralDashboardConnection}
        />
      </View>
      <View style={{ marginLeft: 24 }}>
        <Text>{`${familyConnection.userName} & ${familyConnection.contactName}`}</Text>
        <Text style={{ fontSize: 12 }}>
          {familyConnection.city}, {familyConnection.state}
        </Text>
      </View>
    </View>
  );
};

export default ReferralConnectionCard;
