import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import Tools from "../Screens/Admin/Tools"
import ToolForm from "../Screens/Admin/ToolForm"

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Tools"
                component={Tools}
                options={{
                    title: "Tool Form"
                }}
            />
            <Stack.Screen name="ToolForm" component={ToolForm} />
        </Stack.Navigator>
    )
}
export default function AdminNavigator() {
    return <MyStack />
}