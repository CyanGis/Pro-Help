import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../../modules/auth/screens/Login";

const Stack = createStackNavigator();

export default function LoginStack(){
    return (
        <Stack.Navigator>
            <Stack.Screen name="" component={Login} options={{title: 'Inicio de sesion'}} />
        </Stack.Navigator>
    )
}