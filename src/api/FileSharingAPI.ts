import axios from "axios";
import DiffieHellmanService from "../services/DiffieHellmanService";
import FileService from "../services/FileService";
import { generateRandomId, getFileNameWithoutExtension } from "../utils/functions";
import { BASE_URL } from "../config";


export const FileSharingAPI = {
    async uploadEncryptedFile(file: File, secretKey: string, jwt: string, receiver: string, expiresAt?: number) {
        try {
            const { content, fileType } = await FileService.fileToString(file);
            const encryptedContent = DiffieHellmanService.encrypt(content, secretKey)
            const encryptedFileTxt = FileService.stringToTextFile(encryptedContent, file.name)
            const randomId = generateRandomId()

            const formData = new FormData();
            formData.append("file", encryptedFileTxt);
            formData.append("receiver", receiver);
            formData.append("fileType", fileType)
            formData.append('id', randomId)
            
            formData.append("expiresAt", expiresAt ? String(expiresAt): '')


            console.log("Encrypted file downloaded and decrypted successfully!");

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
    async downloadEncryptedFile(filename: string, secretKey: string, jwt: string, fileType: string) {
        try {
            const response = await axios.get(`${BASE_URL}/encrypt-files/files?filename=${filename}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                responseType: "blob",
            });

            const blob = new Blob([response.data]);
            const encryptedFileTxt = new File([blob], filename, { type: 'text/plain' });
            const encryptedString = await FileService.textFileToString(encryptedFileTxt)
            const decryptedString = DiffieHellmanService.decrypt(encryptedString, String(secretKey))
            const decryptedFile = FileService.stringToFile(decryptedString, getFileNameWithoutExtension(filename), fileType)

            console.log("Encrypted file downloaded and decrypted successfully!");
            FileService.saveFileToClient(decryptedFile);
        } catch (error) {
            console.error("Error downloading or decrypting file:", error);
            throw error;
        }
    },
    async uploadEncryptedMedia(image: File, secretKey: string, jwt: string, receiver: string, expiresAt?: number) {
        const randomId = generateRandomId()
            try {
                const { content, fileType } = await FileService.fileToString(image);
                const encryptedContent = DiffieHellmanService.encrypt(content, secretKey)
                const encryptedFileTxt = FileService.stringToTextFile(encryptedContent, image.name)

                const formData = new FormData();
                formData.append("file", encryptedFileTxt);
                formData.append("filename", image.name)
                formData.append("receiver", receiver);
                formData.append("id", randomId);
                formData.append("fileType", fileType)
                formData.append("expiresAt", expiresAt ? String(expiresAt): '')


                await axios.post(`${BASE_URL}/encrypt-files/media`, formData, {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                console.log("Encrypted file uploaded successfully!");
            } catch (error) {
                console.error("Error uploading encrypted file:", error);
                throw error;
            }
    },
    async downloadEncryptedMedia(filename: string, secretKey: string, jwt: string, fileType: string): Promise<File> {
        try {
            const response = await axios.get(`${BASE_URL}/encrypt-files/files?filename=${filename}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                responseType: "blob",
            });

            const blob = new Blob([response.data]);
            const encryptedFileTxt = new File([blob], filename, { type: 'text/plain' });
            const encryptedString = await FileService.textFileToString(encryptedFileTxt)
            const decryptedString = DiffieHellmanService.decrypt(encryptedString, String(secretKey))
            return FileService.stringToFile(decryptedString, getFileNameWithoutExtension(filename), fileType)
        } catch (error) {
            console.error("Error downloading or decrypting file:", error);
            throw error;
        }
    }
}