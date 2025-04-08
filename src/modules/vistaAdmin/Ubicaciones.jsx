import React, { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, TextInput, Button, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Ubicaciones(props) {
  const { title, description } = props;
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapType, setMapType] = useState('standard');

  const mapRef = useRef(null);
  let subscription;

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
        console.log('Ubicación actual... ', loc.coords);
      }
    );
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      Alert.alert('Por favor, ingresa una ubicación.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const location = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
        setSearchedLocation(location);

        if (mapRef.current) {
          mapRef.current.animateToRegion({
            ...location,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000);
        }
      } else {
        Alert.alert('No se encontró la ubicación.');
      }
    } catch (error) {
      console.error('Error al buscar ubicación:', error);
    } finally {
      setLoading(false);
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
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar ubicación"
        value={searchQuery}
        onChangeText={setSearchQuery}
        clearButtonMode="while-editing"
      />
      <Button title="Buscar" onPress={handleSearch} color="#3b8e9c" />

      {loading && <ActivityIndicator size="large" color="#3b8e9c" style={styles.loadingIndicator} />}

      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          mapType={mapType}
          initialRegion={{
            latitude: location.latitude || 18.85034430274575,
            longitude: location.longitude || -99.2007355056972,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation
          toolbarEnabled
        >
          <Marker
            coordinate={{
              latitude: location.latitude || 18.85034430274575,
              longitude: location.longitude || -99.2007355056972,
            }}
            title={title}
            description={description}
            pinColor="green"
          />
          {searchedLocation && (
            <Marker
              coordinate={searchedLocation}
              title="Ubicación Buscada"
              description={searchQuery}
              pinColor="blue"
            />
          )}
        </MapView>
      )}

      {location && (
        <Button
          title="Centrar en mi ubicación"
          onPress={() => {
            setSearchedLocation(location);
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                ...location,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }, 1000);
            }
          }}
          color="#3b8e9c"
        />
      )}

      {/* Botón flotante con ícono para cambiar vista del mapa */}
      <TouchableOpacity
        style={styles.toggleMapTypeButton}
        onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
      >
        <Icon name={mapType === 'standard' ? 'map' : 'earth'} size={24} color="#fff" />
      </TouchableOpacity>
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
  toggleMapTypeButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#3b8e9c',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
