import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Linking } from 'react-native';
const BASE_URL = "http://192.168.1.80:3002";
const donationService = {
    payTo: async (pago) => {
        try {
            console.log("Enviando pago al servidor:", pago);
            const response = await axios.post(`${BASE_URL}/create-order`, pago, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            console.log("Respuesta completa del servidor:", response);
    
            if (response.data.links) {
                const approvalUrl = response.data.links.find(
                    link => link.rel === "approve" && link.method === "GET"
                )?.href;
                
                if (!approvalUrl) {
                    throw new Error("No se encontró URL de aprobación en la respuesta");
                }
    
                // Verifica que la URL sea válida
                if (!approvalUrl.startsWith('https://www.sandbox.paypal.com/')) {
                    throw new Error(`URL de PayPal inválida: ${approvalUrl}`);
                }
    
                const canOpen = await Linking.canOpenURL(approvalUrl);
                if (!canOpen) {
                    throw new Error("No se puede abrir la URL de PayPal");
                }
    
                await Linking.openURL(approvalUrl);
                return { success: true, url: approvalUrl };
                
            } else {
                throw new Error("Respuesta inesperada del servidor");
            }
        } catch (error) {
            console.error("Error detallado en payTo:", {
                message: error.message,
                response: error.response?.data,
                request: error.config
            });
            throw new Error(error.response?.data?.message || "Error al procesar el pago");
        }
    },
    capturePayment: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/capture-order?token=${token}`);
            console.log("Respuesta de captura:", response.data);
            if (response.data.status === 'COMPLETED') {
                const idCampana = response.data.idCampana;
                const idUsuario = response.data.idUsuario;
                await donationService.registerDonation({
                    ...response.data,
                    idCampana,
                    idUsuario
                });

               
            } else {
                console.error("El pago no fue completado.");
            }
        } catch (error) {
            console.error("Error al capturar el pago:", error);
        }
    },
    fetchTransactionDetails: async (transactionId) =>  {
        if (transactionId) {
            try {
                const response = await axios.get(`http://192.168.1.80:3002/transaction/${transactionId}`);
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
    
    registerDonation: async  (transactionData) => {
      const profile = JSON.parse(AsyncStorage.getItem("profileInfo"));
      const token = AsyncStorage.getItem("token"); 
            const payload = {
                campaignId: transactionData.campaignId,
                amount: parseFloat(transactionData.amount),
                donationDate: transactionData.create_time, 
                donorId: profile.id,
                email: profile.email,
                phone: profile.phone,
                name: profile.name,     
            };
        
            try {
                const response = await fetch("http://192.168.1.80:8080/api/donations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json",  "Authorization": `Bearer ${token}`  },
                    body: JSON.stringify(payload),
                });
        
                const data = await response.json();
                console.log("Donación registrada:", data);
            } catch (error) {
                console.error("Error registrando la donación:", error);
            }
    }, 
 
};

export default donationService;
