import { FamilyConnection, ProfilePicTypes } from 'types';
import React from 'react';
import { View, Text } from 'react-native';
import Facepile from '@components/Image/Facepile';

interface Props {
  familyConnection: FamilyConnection;
}

const ReferralConnectionCard: React.FC<Props> = ({
  familyConnection,
}: Props) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <View>
        <Facepile
          people={[
            {
              image: familyConnection.userImage,
              firstName: familyConnection.userFirstName,
              lastName: familyConnection.userLastName,
            },
            {
              image: familyConnection.contactImage,
              firstName: familyConnection.contactFirstName,
              lastName: familyConnection.contactLastName,
            },
          ]}
          type={ProfilePicTypes.ReferralDashboardConnection}
        />
      </View>
      <View style={{ marginLeft: 24 }}>
        <Text>{`${familyConnection.userFirstName} & ${familyConnection.contactFirstName}`}</Text>
        <Text style={{ fontSize: 12 }}>
          {familyConnection.city}, {familyConnection.state}
        </Text>
      </View>
    </View>
  );
};

export default ReferralConnectionCard;
