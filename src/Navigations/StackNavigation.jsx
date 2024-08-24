import { View, Text } from 'react-native'
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../Screens/Splash';
import Login from '../Screens/Login';
import Web from '../Screens/Web';

const StackNavigation = () => {

    const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName='Splash' screenOptions={{headerShown:false}}>
        <Stack.Screen name='Splash' component={Splash}/>
        <Stack.Screen name='Login' component={Login}/>
        <Stack.Screen name='Web' component={Web}/>
    </Stack.Navigator>
  )
}

export default StackNavigation