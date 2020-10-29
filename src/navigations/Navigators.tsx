import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const RootTab = createBottomTabNavigator();

const AuthStack = createStackNavigator();

const HomeStack = createStackNavigator();

const StoreStack = createStackNavigator();

export { RootTab, AuthStack, HomeStack, StoreStack };