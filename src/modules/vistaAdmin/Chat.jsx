import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../Kernel/firebase.config';

const ChatScreen = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [contacts, setContacts] = useState([]);
  const [email, setEmail] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await AsyncStorage.getItem('profile');
      if (profile) {
        const parsedProfile = JSON.parse(profile);
        const { email } = parsedProfile.user;
        setEmail(email);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!email) return;
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`http://192.168.0.94:8080/api/${email}/contacts`);
        setContacts(response.data || []);
      } catch (error) {
        console.error('Error al cargar los contactos:', error);
      }
    };
    fetchContacts();
  }, [email]);

  useEffect(() => {
    if (!activeChat) return;

    const chatId = getChatId(email, activeChat.email);
    const q = query(collection(db, `chats/${chatId}/messages`), orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesArray);
    });

    return () => unsubscribe();
  }, [activeChat, email]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !activeChat) return;

    const chatId = getChatId(email, activeChat.email);
    const message = {
      text: newMessage,
      sender: email,
      recipient: activeChat.email,
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, `chats/${chatId}/messages`), message);
      setNewMessage('');
      Keyboard.dismiss();  // Ocultar el teclado después de enviar el mensaje
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  const getChatId = (userEmail, recipientEmail) => {
    return userEmail < recipientEmail
      ? `${userEmail}_to_${recipientEmail}`
      : `${recipientEmail}_to_${userEmail}`;
  };

  const renderMessage = (message, index) => (
    <View key={index} style={[styles.messageContainer, message.sender === email ? styles.sentMessage : styles.receivedMessage]}>
      <Text style={styles.messageText}>{message.text}</Text>
    </View>
  );

  const renderContactItem = ({ item }) => (
    <TouchableOpacity style={styles.contactItem} onPress={() => setActiveChat(item)}>
      <Text style={styles.contactName}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Si no hay chat activo, mostramos la lista de contactos */}
      {!activeChat ? (
        <FlatList
          data={contacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.email}
          style={styles.contactList}
        />
      ) : (
        // Si hay un chat activo, mostramos los mensajes
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.chatContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setActiveChat(null)} style={styles.backButton}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
              <Text style={styles.headerText}>{activeChat.nombre}</Text>
            </View>

            <ScrollView style={styles.messagesContainer}>
              {messages.map(renderMessage)}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Escribe un mensaje..."
                placeholderTextColor="#bbb"
                style={styles.input}
              />
              <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>➤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  contactList: {
    flex: 1,
    paddingTop: 10,
  },
  contactItem: {
    padding: 15,
    backgroundColor: '#1E1E1E',
    marginBottom: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#121212',
    borderTopWidth: 1,
    borderTopColor: '#444',
    paddingBottom: 10,
  },
  header: {
    backgroundColor: '#1E1E1E',
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 21,
    color: 'white',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    margin:'auto'
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 20,
    maxWidth: '80%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
  },
  messageText: {
    fontSize: 16,
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#444',
    backgroundColor: '#1E1E1E',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 15,
    backgroundColor: '#333',
    color: 'white',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 50,
  },
  sendButtonText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
});

export default ChatScreen;
