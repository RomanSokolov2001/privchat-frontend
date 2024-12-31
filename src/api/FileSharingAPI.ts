import axios from "axios";
import DiffieHellmanService from "../services/DiffieHellmanService";
import FileService from "../services/FileService";
import { generateRandomId } from "../utils/functions";
import { BASE_URL } from "../config";


export const FileSharingAPI = {
    async uploadEncryptedFile(file: File, secretKey: string, jwt: string, receiver: string) {
        try {
            const { content, fileType } = await FileService.fileToString(file);
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
            const decryptedFile = FileService.stringToFile(decryptedString, filename, fileType)

            console.log("Encrypted file downloaded and decrypted successfully!");
            FileService.saveFileToClient(decryptedFile);
        } catch (error) {
            console.error("Error downloading or decrypting file:", error);
            throw error;
        }
    },
    async uploadEncryptedMedia(images: File[], secretKey: string, jwt: string, receiver: string) {
        const randomId = generateRandomId()
        images.forEach(async img => {
            try {
                const { content, fileType } = await FileService.fileToString(img);
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

                console.log("Encrypted file uploaded successfully!");
            } catch (error) {
                console.error("Error uploading encrypted file:", error);
                throw error;
            }
        })
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
            const decryptedFile = FileService.stringToFile(decryptedString, filename, fileType)

            console.log("Encrypted file downloaded and decrypted successfully!");
            const fileUrl = URL.createObjectURL(decryptedFile);
            console.log("Generated URL for decrypted file:", fileUrl);
            return decryptedFile

        } catch (error) {
            console.error("Error downloading or decrypting file:", error);
            throw error;
        }
    }
}