import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Keyboard, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../Kernel/firebase.config';
import { Ionicons } from '@expo/vector-icons';
import { TouchableWithoutFeedback} from 'react-native';

const ChatScreen = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [contacts, setContacts] = useState([]);
  const [email, setEmail] = useState('');
  const scrollViewRef = useRef();

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await AsyncStorage.getItem('profile');
      if (profile) {
        const parsedProfile = JSON.parse(profile);
        setEmail(parsedProfile.user.email);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!email) return;
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`http://192.168.0.7:8080/api/${email}/contacts`);
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
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [activeChat, email]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

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
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  const getChatId = (userEmail, recipientEmail) =>
    userEmail < recipientEmail ? `${userEmail}_to_${recipientEmail}` : `${recipientEmail}_to_${userEmail}`;

  return (
    <View style={styles.container}>
      {!activeChat ? (
        <FlatList
          data={contacts}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.contactItem} onPress={() => setActiveChat(item)}>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactName}>{item.nombre}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.email}
          style={styles.contactList}
        />
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.chatContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setActiveChat(null)} style={styles.backButton}>
                <Ionicons name="chevron-back" size={20} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerText}>{activeChat.nombre}</Text>
            </View>

            <ScrollView ref={scrollViewRef} style={styles.messagesContainer}>
              {messages.map((message, index) => (
                <View key={index} style={[styles.messageContainer, message.sender === email ? styles.sentMessage : styles.receivedMessage]}>
                  <Text style={styles.messageText}>{message.text}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Escribe un mensaje..."
                placeholderTextColor="#9F9F9F"
                style={styles.input}
              />
              <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                <Ionicons name="send" size={20} color="white" />
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
    backgroundColor: '#e7e7e7' 
  },
  contactList: { 
    flex: 1, 
    paddingTop: 10 
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#AFCCD0',
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  contactTextContainer: { 
    flex: 1 
  },
  contactName: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  contactStatus: { 
    color: 'gray', 
    fontSize: 14 
  },
  statusIndicator: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    marginLeft: 10 
  },
  chatContainer: { 
    flex: 1, 
    backgroundColor: '#181818', 
    paddingBottom: 0
  },
  header: {
    height: 50, 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 2, 
    backgroundColor: '#AFCCD0',
    borderWidth: 1,
    borderColor: 'gray', 
  },
  backButton: { 
    padding: 10 
  },
  headerText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold', 
    flex: 1, 
    textAlign: 'center',
    marginRight: 30, 
  },
  messagesContainer: { 
    flex: 1, 
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#e7e7e7' 
  },
  messageContainer: { 
    marginBottom: 10, 
    padding: 12, 
    borderRadius: 20, 
    maxWidth: '80%' 
  },
  sentMessage: { 
    alignSelf: 'flex-end', 
    backgroundColor: '#BBC181' 
  },
  receivedMessage: { 
    alignSelf: 'flex-start', 
    backgroundColor: '#729BA1' 
  },
  messageText: { 
    fontSize: 16, 
    color: 'white' 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10, 
    backgroundColor: '#e7e7e7' 
  },
  input: { 
    flex: 1, 
    height: 40, 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    backgroundColor: '#e7e7e7',
    borderWidth: 1, 
    borderColor: '#9F9F9F',
  },
  sendButton: { 
    marginLeft: 10, 
    padding: 10, 
    backgroundColor: '#896447', 
    borderRadius: 50 
  },
});

export default ChatScreen;