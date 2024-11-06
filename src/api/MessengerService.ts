import axios, { AxiosResponse } from "axios";
import { useUser } from "../context/UserContext";
import { Http2ServerResponse } from "http2";
import DiffieHellmanService from "./DiffieHellmanService";
import { AcceptChatRequestDto, ChatRequestDto, MessageDto } from "../types";

const BASE_URL = "http://localhost:8080"; // Update with actual backend URL

const BIG_PRIMITIVE = 13
const GENERATOR = 2



export const MessengerService = {
  async getMessages() {
    const response = await axios.get(`${BASE_URL}/encrypt-chat/messages`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("authToken")}` }
    });
    return response.data;
  },

  async sendMessage(receiver: string, content: string, secretKey: string) {
    const encryptedContent = DiffieHellmanService.encrypt(content, secretKey)
    const dto = {content: encryptedContent, receiver: receiver}

    const response = await axios.post(`${BASE_URL}/encrypt-chat/messages`, dto, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("authToken")}` }
    });
    if (response.status==200) {
      console.log('Message sent')
      console.log(`Message: ${response.data}`)
    }
    return response.data;
  },

  async getMessagesFromUser(nickname: string, secretKey: string) {

    const response = await axios.get(`${BASE_URL}/encrypt-chat/messages-from`, {
      params: { nickname },
      headers: { Authorization: `Bearer ${sessionStorage.getItem("authToken")}` }
    });

    return DiffieHellmanService.decryptMessages(response.data, secretKey)
  },

  async getChatRequests() {
    try {
      const response = await axios.get(`${BASE_URL}/encrypt-chat/receive`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("authToken")}` }
      });
      return response.data
    } catch (error) {
      return { data: [] }
    }
  },

  async trySendChatRequest(dto: ChatRequestDto) {
    try {
      const response = await axios.post(
        `${BASE_URL}/encrypt-chat/create`,
        dto,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
          }
        }
      );
      if (response.status == 200) {
        console.log("Chat request sent successfully!");

      }
      console.log(dto);
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

  async acceptChatRequest(dto: AcceptChatRequestDto) {
    try {
      const response = await axios.post(
        `${BASE_URL}/encrypt-chat/accept`,
        dto,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
          }
        }
      );

      console.log("Chat request accepted successfully!");
      console.log(dto);
      return "success";

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

  async denyChatRequest(chatRequest: ChatRequestDto) {
    const response = await axios.post(`${BASE_URL}/messenger/requests-deny`, chatRequest, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("authToken")}` }
    });
    return response.data; // Confirms denial of ChatRequest
  },

  async getChats() {
    const response = await axios.get(`${BASE_URL}/encrypt-chat/receive-completed`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("authToken")}` }
    });
    return response.data;
  }
};

