import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { LOGIN, REGISTER } from '../utils/constant_route';

import Login from '../screens/Login';
import Register from '../screens/Register';

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
