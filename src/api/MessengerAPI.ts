import axios from "axios";
import DiffieHellmanService from "../services/DiffieHellmanService";
import { ChatRequestDto } from "../types";
import { BASE_URL } from "../config";
import { generateRandomId } from "../utils/functions";



export const MessengerAPI = {
  async getMessages(jwt: string) {
    const response = await axios.get(`${BASE_URL}/encrypt-chat/messages`, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
    return response.data;
  },

  async sendMessage(receiver: string, content: string, secretKey: string, jwt: string) {
    const encryptedContent = DiffieHellmanService.encrypt(content, secretKey)
    const randomId = generateRandomId()
    const createdAt = new Date()
    const dto = { content: encryptedContent, receiver: receiver, id: randomId, createdAt: createdAt}

    const response = await axios.post(`${BASE_URL}/encrypt-chat/messages`, dto, {
      headers: { Authorization: `Bearer ${jwt}` }
    });

    return response.data;
  },

  async getMessagesFromUser(nickname: string, secretKey: string, jwt: string) {

    const response = await axios.get(`${BASE_URL}/encrypt-chat/messages-from`, {
      params: { nickname },
      headers: { Authorization: `Bearer ${jwt}` }
    });

    return DiffieHellmanService.decryptMessages(response.data, secretKey)
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

  async sendChatRequest(dto: ChatRequestDto, jwt: string) {

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
  }
}