import axios from "axios";
import DiffieHellmanService from "../services/DiffieHellmanService";
import { ChatRequestDto } from "../types";
import { BASE_URL } from "../config";
import { generateRandomId } from "../utils/functions";


export const MessengerAPI = {
  async sendMessage(receiver: string, content: string, secretKey: string, jwt: string, expiresAt?: number) {
    const encryptedContent = DiffieHellmanService.encrypt(content, secretKey)
    const randomId = generateRandomId()

    const dto = { content: encryptedContent, receiver: receiver, id: randomId, createdAt: new Date(), expiresAt, type: "message"}

    const response = await axios.post(`${BASE_URL}/chat/messages`, dto, {
      headers: { Authorization: `Bearer ${jwt}` }
    });

    return response.data;
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

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          console.log("Request does not exist");
          return "not found";
        }
      }
      console.log('Error:', error);
      return "error";
    }
  },

  async sendChatRequest(dto: any, jwt: string) {
    const randomId = generateRandomId()
    dto.chatId = randomId;
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

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          console.log("Request already exists");
          return "duplicate";
        }
      }
      console.log('Error:', error);
      return "error";
    }
  },

  async sendTimerMessage(receiver: string, time: number, jwt: string) {
    const randomId = generateRandomId()
    const dto = { content: time, receiver: receiver, id: randomId, type: 'timer', expiresAt: '', createdAt: new Date()}

    const response = await axios.post(`${BASE_URL}/chat/messages`, dto, {
      headers: { Authorization: `Bearer ${jwt}` }
    });

    return response.data;
  },
  async sendDeleteCommand(receiver: string, time: number, jwt: string) {
    const dto = { receiver: receiver, type: 'delete-chat', createdAt: new Date()}

    const response = await axios.post(`${BASE_URL}/chat/messages`, dto, {
      headers: { Authorization: `Bearer ${jwt}` }
    });

    return response.data;
  },
  async sendClearCommand(receiver: string, time: number, jwt: string) {
    const dto = { receiver: receiver, type: 'clear-chat', createdAt: new Date()}

    const response = await axios.post(`${BASE_URL}/chat/messages`, dto, {
      headers: { Authorization: `Bearer ${jwt}` }
    });

    return response.data;
  },
  async confirmThatMessageReached(messageId: string, receiver: string, jwt: string, isWatched: boolean) {
    let state
    isWatched ? state = 'watched' : state = 'reached'
    const dto = {messageId, receiver}
    const response = await axios.post(`${BASE_URL}/chat/confirm-${state}`, dto, {
      headers: { Authorization: `Bearer ${jwt}` }
    });

    return response.data;
  },
  async confirmThatMessageWatched(messageId: string, receiver: string, jwt: string) {
    const dto = {messageId, receiver}
    const response = await axios.post(`${BASE_URL}/chat/confirm-watched`, dto, {
      headers: { Authorization: `Bearer ${jwt}` }
    });

    return response.data;
  }
}
