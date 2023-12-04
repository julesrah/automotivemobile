import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import ToolContainer from '../Screens/Tool/ToolContainer'
import SingleTool from '../Screens/Tool/SingleTool'

const Stack = createStackNavigator()
function MyStack() {
    return (
        <Stack.Navigator>
            
            <Stack.Screen name='Home' component={ToolContainer} options={{ headerShown: false,}}/>
            <Stack.Screen name='Tool Detail' component={SingleTool} options={{ headerShown: false,}}/>

        </Stack.Navigator>
    )
}

export default function HomeNavigator() {
    return <MyStack />;
}