import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Beneficiarios from "../../modules/vistaAdmin/Beneficiarios";

const Stack = createStackNavigator();

export default function LoginStack(){
    return (
        <Stack.Navigator>
            <Stack.Screen name="" component={Beneficiarios} options={{title: 'Beneficiarios Registrados'}} />
        </Stack.Navigator>
    )
}