import React from 'react';
import { Text } from 'react-native';
import { StoreStack } from './Navigators';

const DummyScreen: React.FC = () => {
  return <Text>Hello</Text>;
};

const Store: React.FC = () => {
  return (
    <StoreStack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}
    >
      <StoreStack.Screen name="Dummy" component={DummyScreen} />
    </StoreStack.Navigator>
  );
};

export default Store;
