import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Linking } from 'react-native';

const BASE_URL = "http://192.168.1.67:3002";

const donationService = {
    payTo: async (pago) => {
        try {
            const response = await axios.post(`${BASE_URL}/create-order`, pago);
            
            if (response.data.links) {
                const approvalUrl = response.data.links.find(
                    link => link.rel === "approve" && link.method === "GET"
                )?.href;
                
                if (approvalUrl) {
                    await Linking.openURL(approvalUrl);
                    return { success: true, url: approvalUrl };
                }
            }
            throw new Error('No se pudo obtener URL de aprobación');
        } catch (error) {
            console.error('Error en payTo:', error);
            throw error;
        }
    },
    capturePayment: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/capture-order?token=${token}`);
            
            if (response.data.status === 'COMPLETED') {
                await donationService.registerDonation({
                    idCampana: response.data.idCampana,
                    idUsuario: response.data.idUsuario,
                    amount: response.data.amount,
                    transactionId: response.data.transactionId
                });
            }
             else {
                throw new Error("El pago no fue completado");
            }
        } catch (error) {
            console.error("Error al capturar el pago:", error);
            throw error;
        }
    },
    fetchTransactionDetails: async (transactionId) =>  {
        if (transactionId) {
            try {
                const response = await axios.get(`http://192.168.1.67:3002/transaction/${transactionId}`);
                return response.data;
            } catch (error) {
                console.error("Error obteniendo los detalles de la transacción:", error);
            }
        }
    },
 /*
    public class DonationEntity {
        @Id
        private String id;
        private String campaignId;
        private String donorId;
        private double amount;
        private String email;
        private String phone;
        private String name;
        private LocalDateTime donationDate;
    }
        */
    
    registerDonation: async (transactionData) => {
        try {
          const profileRaw = await AsyncStorage.getItem("profileInfo");
          const token = await AsyncStorage.getItem("token"); 
      
          const profile = JSON.parse(profileRaw);
      
          const payload = {
              campaignId: transactionData.campaignId,
              amount: parseFloat(transactionData.amount),
              donationDate: transactionData.create_time, 
              donorId: profile.id,
              email: profile.email,
              phone: profile.phone,
              name: profile.name,     
          };
      
          const response = await fetch("http://192.168.1.67:8080/api/donations", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify(payload),
          });
      
          const data = await response.json();
          console.log("Donación registrada:", data);
        } catch (error) {
          console.error("Error registrando la donación:", error);
        }
      }
      
 
};

export default donationService;
