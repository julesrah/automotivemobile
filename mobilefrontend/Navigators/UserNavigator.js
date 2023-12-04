import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'

import Start from '../Screens/User/Start';
import Login from '../Screens/User/Login';
import Register from '../Screens/User/Register';
import UserProfile from '../Screens/User/UserProfile';
import UserUpdate from '../Screens/User/UserUpdate';
import ForgetPassword from '../Screens/User/ForgetPassword';

const Stack = createStackNavigator();

const UserNavigator = (props) => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Start" options={{headerShown: false}}component={Start}></Stack.Screen>
            <Stack.Screen name="Login" options={{headerShown: false}} component={Login}></Stack.Screen>
            <Stack.Screen name="Register" options={{headerShown: false}} component={Register}></Stack.Screen>
            <Stack.Screen name="UserProfile" options={{headerShown: false}} component={UserProfile}></Stack.Screen>
            <Stack.Screen name="UserUpdate" options={{headerShown: false}} component={UserUpdate}></Stack.Screen>
            <Stack.Screen name="ForgetPassword" options={{headerShown: false}} component={ForgetPassword}></Stack.Screen>
        </Stack.Navigator>
    )
}

export default UserNavigator;