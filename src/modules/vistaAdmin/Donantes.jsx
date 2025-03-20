import React, { useState } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importa solo el componente Icon

export default function Donantes() {
  const donors = [
    { id: '1', name: 'Juan Pérez' },
    { id: '2', name: 'María López' },
    { id: '3', name: 'Carlos Sánchez' },
  ];

  const [selectedAction, setSelectedAction] = useState(null); // Para guardar el ID y la acción
  const [modalVisible, setModalVisible] = useState(false); // Controla la visibilidad del modal

  const handleActionPress = (action, id) => {
    setSelectedAction({ action, id });
    setModalVisible(true);
  };

  const confirmAction = () => {
    console.log(`${selectedAction.action} confirmado para el ID: ${selectedAction.id}`);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Donantes</Text>
      <FlatList
        data={donors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.donorItem}>
            <Text style={styles.donorName}>{item.name}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleActionPress('Eliminar', item.id)}>
                <Icon name="delete" size={24} color="red" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleActionPress('Inhabilitar', item.id)}>
                <Icon name="block" size={24} color="orange" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleActionPress('Desactivar', item.id)}>
                <Icon name="power-settings-new" size={24} color="blue" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal de confirmación */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              ¿Estás seguro de que deseas {selectedAction?.action?.toLowerCase()} al donante con ID: {selectedAction?.id}?
            </Text>
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Confirmar" onPress={confirmAction} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  donorItem: {
    flexDirection: 'row', // Los elementos están alineados horizontalmente
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  donorName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // Ocupa el espacio disponible
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 100, // Ajusta el ancho según sea necesario
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
