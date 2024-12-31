import * as CryptoJS from 'crypto-js';
import { MessageInterface } from '../types';


const P = BigInt(23)
const g = BigInt(2)

export const DiffieHellmanService = {
    generateSecret() {
        const randomKey = BigInt(Math.floor(Math.random() * Number(P - g) + 1));
        return randomKey;
    },

    modularExponentiation(base: bigint, exponent: bigint, modulus: bigint) {
        if (modulus === BigInt(1)) return BigInt(0);
        let result = BigInt(1);
        base = base % modulus;
        while (exponent > 0) {
            if (exponent % BigInt(2) === BigInt(1)) {
                result = (result * base) % modulus;
            }
            exponent = exponent >> BigInt(1);
            base = (base * base) % modulus;
        }
        return result;
    },

    generatePublicKey(secret: bigint) {
        const pubKey = this.modularExponentiation(g, secret, P);
        return pubKey;
    },

    generateSharedSecret(otherPartyPublicKey: string, ownPrivateKey: string) {
        if (!otherPartyPublicKey || !ownPrivateKey) return null;
        return this.modularExponentiation(BigInt(otherPartyPublicKey), BigInt(ownPrivateKey), P);
    },

    handleGenerateKeys() {
        var secret = this.generateSecret();
        const publicKey = String(this.generatePublicKey(secret));
        console.log("Private Key (Secret):", secret.toString());
        console.log("Public Key:", publicKey.toString());
        return { secret, publicKey };
    },

    encrypt(plainText: string, secretKey: string) {
        const cipherText = CryptoJS.AES.encrypt(plainText, secretKey).toString()
        return cipherText
    },

    decrypt(cipherText: string, secretKey: string) {
        const bytes = CryptoJS.AES.decrypt(cipherText, secretKey)
        const plainText = bytes.toString(CryptoJS.enc.Utf8)
        return plainText
    },

    decryptMessages(messages: MessageInterface[], secretKey: string) {
      
        const decryptedMessages = messages.map((msg) => {
          if (!msg.content) return {}
          
            msg.content = this.decrypt(msg.content, secretKey)
            return msg
        })

        return decryptedMessages
    },

    // Unused
    async encryptFile(file: File, secretKey: string): Promise<File> {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = () => {
            try {
              const fileData = reader.result as string;
              const encryptedData = this.encrypt(fileData, secretKey);
    
              const encryptedBlob = new Blob([encryptedData], { type: file.type });
              const encryptedFile = new File([encryptedBlob], `${file.name}.enc`, {
                type: file.type,
              });
    
              resolve(encryptedFile);
            } catch (error) {
              reject(error);
            }
          };
    
          reader.onerror = (error) => reject(error);
          reader.readAsText(file);
        });
      },
    
      // Unused
      async decryptFile(encryptedFile: File, secretKey: string): Promise<File> {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = () => {
            try {
              const encryptedData = reader.result as string;
              const decryptedData = this.decrypt(encryptedData, secretKey);
      
              const removeTimestamp = (filename: string) => filename.replace(/^\d+_/, '');
              const newFileName = removeTimestamp(encryptedFile.name.replace('.enc', ''));
      
              const decryptedBlob = new Blob([decryptedData], { type: encryptedFile.type });
              const decryptedFile = new File([decryptedBlob], newFileName, {
                type: encryptedFile.type,
              });
      
              resolve(decryptedFile);
            } catch (error) {
              reject(error);
            }
          };
      
          reader.onerror = (error) => reject(error);
          reader.readAsText(encryptedFile);
        });
      }
}

export default DiffieHellmanService;