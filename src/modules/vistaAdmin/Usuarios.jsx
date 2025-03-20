import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";//tab navigation
import { Icon } from "@rneui/base";
import Donantes from "./Donantes";
import Beneficiarios from "./Beneficiarios";

const Tab = createBottomTabNavigator();

export default function Usuarios(){
    return(
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  const { iconName, iconType } = getIconName(route.name, focused);
                  return (
                    <Icon name={iconName} type={iconType} size={size} color={color} />
                  );
                },
                tabBarActiveTintColor: "#AFCCD0",
                tabBarInactiveTintColor: "black",
                headerShown: false,
              })}
            >
                <Tab.Screen
                name="Donantes"
                component={Donantes}
                options={{title: "Donantes"}}
                />
                <Tab.Screen
                name="Beneficiarios"
                component={Beneficiarios}
                options={{title: "Beneficiarios"}}
                />

            </Tab.Navigator>
    )
}

const getIconName = (routeName, focused) => {
    let iconName = "";
    let iconType = "material-community";
  
    switch (routeName) {
      case "Donantes":
        iconName = focused ? "hand-heart" : "hand-heart-outline";
        break;
      case "Beneficiarios":
        iconName = focused ? "hand-extended" : "hand-extended-outline";
        break;
    }
    return { iconName, iconType };
  };