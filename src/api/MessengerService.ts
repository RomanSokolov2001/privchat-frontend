import axios from "axios";
import DiffieHellmanService from "./DiffieHellmanService";
import { ChatRequestDto, FileEntry, IP, MediaEntry } from "../types";
import { generateRandomId } from "../utils/functions";
import FileService from "./FileService";

const BASE_URL = `http://${IP}`;


export const MessengerService = {
  async getMessages(jwt: string) {
    const response = await axios.get(`${BASE_URL}/encrypt-chat/messages`, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
    return response.data;
  },

  async sendMessage(receiver: string, content: string, secretKey: string, jwt: string) {
    const encryptedContent = DiffieHellmanService.encrypt(content, secretKey)
    const dto = { content: encryptedContent, receiver: receiver }

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
      console.log(response)

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
  },

  // Upload Encrypted File
  async uploadEncryptedFile(file: File, secretKey: string, jwt: string, receiver: string) {
    try {
      // Encrypt the file content
      const {content, fileType} = await FileService.fileToString(file);
      const encryptedContent = DiffieHellmanService.encrypt(content, secretKey)
      const encryptedFileTxt = FileService.stringToTextFile(encryptedContent, file.name)   

      const formData = new FormData();
      formData.append("file", encryptedFileTxt);
      formData.append("receiver", receiver);
      formData.append("fileType", fileType)

      const response = await axios.post(`${BASE_URL}/encrypt-files/files`, formData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Encrypted file uploaded successfully!");
      return response.data;
    } catch (error) {
      console.error("Error uploading encrypted file:", error);
      throw error;
    }
  },

  // Retrieve Encrypted File
  async downloadEncryptedFile(filename: string, secretKey: string, jwt: string, fileType: string) {
    try {
      const response = await axios.get(`${BASE_URL}/encrypt-files/files?filename=${filename}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        responseType: "blob",
      });
      
      const blob = new Blob([response.data]);
      const encryptedFileTxt = new File([blob], filename, {type:  'text/plain'});
      const encryptedString = await FileService.textFileToString(encryptedFileTxt)
      const decryptedString = DiffieHellmanService.decrypt(encryptedString, String(secretKey))
      const decryptedFile = FileService.stringToFile(decryptedString, filename, fileType)

      // Decrypt the file

      console.log("Encrypted file downloaded and decrypted successfully!");
      saveFileToClient(decryptedFile);
    } catch (error) {
      console.error("Error downloading or decrypting file:", error);
      throw error;
    }
  },

  async uploadEncryptedMedia(images: File[], secretKey: string, jwt: string, receiver: string) {
    const randomId = generateRandomId()
    images.forEach(async img => {
      try {

        const {content, fileType} = await FileService.fileToString(img);
        const encryptedContent = DiffieHellmanService.encrypt(content, secretKey)
        const encryptedFileTxt = FileService.stringToTextFile(encryptedContent, img.name)        

        const formData = new FormData();
        formData.append("file", encryptedFileTxt);
        formData.append("filename", img.name)
        formData.append("receiver", receiver);
        formData.append("randomId", randomId);
        formData.append("fileType", fileType)

        await axios.post(`${BASE_URL}/encrypt-files/media`, formData, {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "multipart/form-data",
          },
        });

        // console.log("Encrypted file uploaded successfully!");
      } catch (error) {
        console.error("Error uploading encrypted file:", error);
        throw error;
      }
    })
  },
    // Retrieve Encrypted File
    async downloadEncryptedMedia(filename: string, secretKey: string, jwt: string, fileType: string):Promise<File> {
      try {
        const response = await axios.get(`${BASE_URL}/encrypt-files/files?filename=${filename}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          responseType: "blob",
        });
        const blob = new Blob([response.data]);
        const encryptedFileTxt = new File([blob], filename, {type:  'text/plain'});
        const encryptedString = await FileService.textFileToString(encryptedFileTxt)
        const decryptedString = DiffieHellmanService.decrypt(encryptedString, String(secretKey))
        const decryptedFile = FileService.stringToFile(decryptedString, filename, fileType)
  
        console.log("Encrypted file downloaded and decrypted successfully!");
        const fileUrl = URL.createObjectURL(decryptedFile);
        console.log("Generated URL for decrypted file:", fileUrl);
        return decryptedFile

      } catch (error) {
        console.error("Error downloading or decrypting file:", error);
        throw error;
      }
    },
}

function saveFileToClient(file: File): void {
  const url = URL.createObjectURL(file);

  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;

  document.body.appendChild(link);

  link.click();

  URL.revokeObjectURL(url);
  document.body.removeChild(link);
}