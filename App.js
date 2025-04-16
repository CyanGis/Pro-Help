import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import * as Linking from 'expo-linking';
import Navigation from './src/navigation/Navigation';
import payIt from './src/Kernel/payIt';

const Stack = createStackNavigator();

// Configuración de Deep Linking
const prefix = Linking.createURL('/');
const linking = {
  prefixes: [prefix, 'prohelp://'], // Cambia 'tuapp' por tu esquema personalizado
  config: {
    screens: {
      PaymentSuccess: 'paypal-return/success', // Ajusta según tus rutas
      PaymentCancel: 'paypal-return/cancel'
    }
  }
};

export default function App() {
  // Manejador de Deep Links
  const handleDeepLink = ({ url }) => {
    const route = url.replace(/.*?:\/\//g, '');
    const [path, queryString] = route.split('?');
    const params = {};
    
    if (queryString) {
      queryString.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        params[key] = value;
      });
    }

    console.log('Deep Link recibido:', { path, params });

    if (path.includes('paypal-return/success')) {
      // Capturar el pago cuando vuelve de PayPal
      if (params.token) {
        payIt.capturePayment(params.token)
          .then(() => {
            // Navegar a pantalla de éxito
            // Necesitarás acceso a navigation aquí (ver nota abajo)
          })
          .catch(error => {
            console.error('Error al capturar pago:', error);
          });
      }
    }
  };

  // Efecto para escuchar Deep Links
  useEffect(() => {
    // Escuchar cuando la app está abierta
    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    // Manejar cuando la app se abre desde un link
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, []);

  return (
    <Navigation linking={linking} />
  );
}