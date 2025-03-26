import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, TextInput, Button, Alert, Text, ActivityIndicator } from 'react-native';

export default function Ubicaciones(props) {
  const { title, description } = props;
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [loading, setLoading] = useState(false); // Para mostrar el indicador de carga
  let subscription;

  // Obtener la ubicación actual
  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permiso de ubicación denegado');
      return;
    }

    subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (loc) => {
        setLocation(loc.coords);
        console.log('Ubicacion actual... ', loc.coords);
      }
    );
  };

  // Función para buscar ubicaciones sin API Key
  const handleSearch = async () => {
    if (!searchQuery) {
      Alert.alert('Por favor, ingresa una ubicación.');
      return;
    }

    setLoading(true); // Iniciar carga
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const location = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
        setSearchedLocation(location);
      } else {
        Alert.alert('No se encontró la ubicación.');
      }
    } catch (error) {
      console.error('Error al buscar ubicación:', error);
    } finally {
      setLoading(false); // Finalizar carga
    }
  };

  useEffect(() => {
    startTracking();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Campo de búsqueda */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar ubicación"
        value={searchQuery}
        onChangeText={setSearchQuery}
        clearButtonMode="while-editing"
      />
      <Button title="Buscar" onPress={handleSearch} color="#3b8e9c" />

      {/* Indicador de carga */}
      {loading && <ActivityIndicator size="large" color="#3b8e9c" style={styles.loadingIndicator} />}

      {/* Mapa */}
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude || 18.85034430274575,
            longitude: location.longitude || -99.2007355056972,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          zoomControlEnabled={true}
          showsUserLocation={true}
          toolbarEnabled
        >
          {/* Marcador de ubicación actual */}
          <Marker
            coordinate={{
              latitude: location.latitude || 18.85034430274575,
              longitude: location.longitude || -99.2007355056972,
            }}
            title={title}
            description={description}
            pinColor="green" // Marcador de ubicación actual
          />

          {/* Si se busca una ubicación, mostrarla */}
          {searchedLocation && (
            <Marker
              coordinate={searchedLocation}
              title="Ubicación Buscada"
              description={searchQuery}
              pinColor="blue" // Marcador de ubicación buscada
            />
          )}
        </MapView>
      )}

      {/* Botón para centrar el mapa en la ubicación actual */}
      {location && (
        <Button title="Centrar en mi ubicación" onPress={() => setSearchedLocation(location)} color="#3b8e9c" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
  },
  searchInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
    marginTop: 20,
    paddingLeft: 15,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: 400,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  loadingIndicator: {
    marginTop: 20,
  },
});
