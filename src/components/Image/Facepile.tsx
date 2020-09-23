import ProfilePic from '@components/ProfilePic/ProfilePic.react';
import { ProfilePicTypes } from 'types';
import React from 'react';
import { View } from 'react-native';

interface Person {
  image: string;
  firstName: string;
  lastName: string;
}

interface Props {
  people: Person[];
  type: ProfilePicTypes;
}

const Facepile: React.FC<Props> = ({ people, type }: Props) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      {people.map((person) => (
        <View
          style={{ marginRight: -12 }}
          key={`${person.firstName}-${person.lastName}`}
        >
          <ProfilePic
            imageUri={person.image}
            firstName={person.firstName}
            lastName={person.lastName}
            type={type}
            disabled
          />
        </View>
      ))}
    </View>
  );
};

export default Facepile;
