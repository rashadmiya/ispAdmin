import { View, Text } from 'react-native'
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { REGISTER, LOGIN } from '../utils/constant_route';

import Register from '../screens/Register';
import Login from '../screens/Login';
import Header from './Header';

const AuthStackNavigator = () => {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName={LOGIN}> 
        <Stack.Screen options={{headerShown:false}} name={REGISTER} component={Register}></Stack.Screen>
        <Stack.Screen options={{headerShown:false}} name={LOGIN} component={Login}></Stack.Screen>
    </Stack.Navigator>
 );
}

export default AuthStackNavigator;
