import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
  Image
} from 'react-native';
import { Icon } from '@rneui/base';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Donantes = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDonations, setLoadingDonations] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [donationsData, setDonationsData] = useState({});
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [profileInfo, setProfileInfo] = useState(null);

  // Obtener información del perfil al cargar
  useEffect(() => {
    const getProfile = async () => {
      const profile = await AsyncStorage.getItem('profileInfo');
      setProfileInfo(JSON.parse(profile));
    };
    getProfile();
  }, []);

  // Función para obtener las donaciones de un usuario
  const fetchDonations = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`http://192.168.1.80:8080/api/donations/donor/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      return response.data.length;
    } catch (error) {
      console.error('Error al obtener las donaciones', error);
      return 0;
    }
  };

  // Función para obtener todos los usuarios
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://192.168.1.80:8080/api/adminuser/get-all-users', {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      
      // Filtrar usuarios activos excluyendo al usuario actual
      const activeUsers = response.data.userEntityList.filter(user => 
        user.active && user.email !== profileInfo?.email
      );

      setUsers(activeUsers);
      setLoadingDonations(true);
      
      // Obtener donaciones para cada usuario
      const donations = {};
      for (let user of activeUsers) {
        const userDonations = await fetchDonations(user.id);
        donations[user.id] = userDonations;
      }
      
      setDonationsData(donations);
    } catch (error) {
      console.error('Error al obtener los usuarios', error);
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
      setLoadingDonations(false);
    }
  };

  useEffect(() => {
    if (profileInfo) {
      fetchUsers();
    }
  }, [profileInfo]);

  // Función para deshabilitar usuario
  const disableUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.patch(
        `http://192.168.1.80:8080/api/admin/disable-user/${selectedUserId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      Alert.alert('Éxito', 'Usuario deshabilitado correctamente', [
        { text: 'OK', onPress: () => fetchUsers() }
      ]);
    } catch (error) {
      console.error('Error al deshabilitar al usuario', error);
      Alert.alert('Error', 'Hubo un problema al deshabilitar el usuario');
    } finally {
      setShowDisableModal(false);
    }
  };

  // Filtrar usuarios por email
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  // Renderizar cada item de la lista
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="account-circle" type="material-community" size={40} color="#4CAF50" />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userPhone}>{item.phone}</Text>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <View style={styles.donationsContainer}>
          <Icon name="heart" type="material-community" size={20} color="#F44336" />
          <Text style={styles.donationsText}>
            {loadingDonations ? 'Cargando...' : donationsData[item.id] || 0} donaciones
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.disableButton}
          onPress={() => {
            setSelectedUserId(item.id);
            setShowDisableModal(true);
          }}
        >
          <Text style={styles.disableButtonText}>Deshabilitar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por correo electrónico"
          value={searchEmail}
          onChangeText={setSearchEmail}
          placeholderTextColor="#999"
        />
        <Icon name="magnify" type="material-community" size={24} color="#666" />
      </View>
      
      {/* Contador de usuarios */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>Total de donantes: {users.length}</Text>
      </View>
      
      {/* Lista de usuarios */}
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No se encontraron donantes</Text>
          }
        />
      )}
      
      {/* Modal de confirmación */}
      <Modal
        visible={showDisableModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDisableModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Estás seguro?</Text>
            <Text style={styles.modalText}>
              Esta acción deshabilitará al usuario. ¿Deseas continuar?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDisableModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={disableUser}
              >
                <Text style={styles.modalButtonText}>Deshabilitar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  counterContainer: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignSelf: 'center',
  },
  counterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 50,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 10,
  },
  donationsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donationsText: {
    marginLeft: 5,
    color: '#666',
  },
  disableButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  disableButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#F44336',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Donantes;