import axios from "axios";
import DiffieHellmanService from "../services/DiffieHellmanService";
import {BASE_URL} from "../config";
import {generateRandomId} from "../utils/functions";


export const MessengerAPI = {
    async sendMessage(receiver: string, content: string, secretKey: string, chatId: string, jwt: string, expiresAt?: number) {
        try {
            const encryptedContent = DiffieHellmanService.encrypt(content, secretKey)
            const dto = {
                content: encryptedContent,
                receiver: receiver,
                chatId: chatId,
                id: generateRandomId(),
                createdAt: new Date(),
                expiresAt,
                type: "message"
            }

            const response = await axios.post(`${BASE_URL}/chat/messages`, dto, {
                headers: {Authorization: `Bearer ${jwt}`}
            });
            return response.data;

        } catch (e) {
            console.error('@sendMessage:', e);
            throw e;
        }
    },
    async getChats(requestedPublicKey: string, jwt: string) {
        try {

            const response = await axios.post(
                `${BASE_URL}/encrypt-chat/process`,
                requestedPublicKey,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        "Content-Type": "text/plain",
                    },
                }
            );
            return response.data;

        } catch (e) {
            console.error('@getChat:', e);
            throw e;
        }
    },
    async sendChatRequest(dto: any, jwt: string) {
        const chatId = generateRandomId()
        dto.chatId = chatId;
        try {

            const response = await axios.post(
                `${BASE_URL}/encrypt-chat/create`,
                dto,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                }
            );
            if (response.status == 200) {
                console.log("Chat request sent successfully!");

            } else {
                console.log("Chat request was not send")
            }
            return "success";

        } catch (e) {
            console.error('@sendChatRequest:', e);
            throw e;
        }
    },
    async sendTimerMessage(receiver: string, chatId: string, time: number, jwt: string) {
        try {

            const dto = {
                content: time,
                chatId,
                receiver: receiver,
                id: generateRandomId(),
                type: 'timer',
                expiresAt: '',
                createdAt: new Date()
            }
            const response = await axios.post(`${BASE_URL}/chat/messages`, dto, {
                headers: {Authorization: `Bearer ${jwt}`}
            });
            return response.data;

        } catch (e) {
            console.error('@sendTimerMessage:', e);
            throw e;
        }
    },
    async sendDeleteCommand(receiver: string, chatId: string, jwt: string) {
        try {

            const dto = {receiver: receiver, type: 'delete-chat', createdAt: new Date(), chatId}
            const response = await axios.post(`${BASE_URL}/chat/messages`, dto, {
                headers: {Authorization: `Bearer ${jwt}`}
            });
            return response.data;

        } catch (e) {
            console.error('@sendDeleteCommand:', e);
            throw e;
        }
    },
    async sendClearCommand(receiver: string, chatId: string, jwt: string) {
        try {

            const dto = {receiver: receiver, type: 'clear-chat', createdAt: new Date(), chatId}
            const response = await axios.post(`${BASE_URL}/chat/messages`, dto, {
                headers: {Authorization: `Bearer ${jwt}`}
            });
            return response.data;

        } catch (e) {
            console.error('@sendClearCommand:', e);
            throw e;
        }
    },
    async confirmThatMessageReached(messageId: string, receiver: string, jwt: string, isWatched: boolean) {
        try {

            let state
            isWatched ? state = 'watched' : state = 'reached'
            const dto = {messageId, receiver}
            const response = await axios.post(`${BASE_URL}/chat/confirm-${state}`, dto, {
                headers: {Authorization: `Bearer ${jwt}`}
            });
            return response.data;

        } catch (e) {
            console.error('@confirmThatMessageReached:', e);
            throw e;
        }
    },
    async confirmThatMessageWatched(messageId: string, receiver: string, jwt: string) {
        try {

            const dto = {messageId, receiver}
            const response = await axios.post(`${BASE_URL}/chat/confirm-watched`, dto, {
                headers: {Authorization: `Bearer ${jwt}`}
            });
            return response.data;

        } catch (e) {
            console.error('@confirmThatMessageWatched:', e);
            throw e;
        }
    }
}
