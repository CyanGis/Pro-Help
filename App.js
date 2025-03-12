import React, { useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Navigation from './src/navigation/Navigation';

const Stack = createStackNavigator();

export default function App() {
    return (
        <Navigation/>
    );
}

