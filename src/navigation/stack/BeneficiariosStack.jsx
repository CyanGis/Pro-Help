import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Beneficiarios from "../../modules/vistaAdmin/Donantes";

const Stack = createStackNavigator();

export default function BeneficiariossStack(){
    return (
        <Stack.Navigator>
            <Stack.Screen name="" component={Beneficiarios} options={{title: 'Beneficiarios'}} />
        </Stack.Navigator>
    )
}