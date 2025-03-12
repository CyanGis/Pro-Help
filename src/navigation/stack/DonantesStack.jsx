import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Donantes from "../../modules/vistaAdmin/Donantes";
const Stack = createStackNavigator();

export default function LoginStack(){
    return (
        <Stack.Navigator>
            <Stack.Screen name="" component={Donantes} options={{title: 'Donantes Registrados'}} />
        </Stack.Navigator>
    )
}