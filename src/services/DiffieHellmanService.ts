import * as CryptoJS from 'crypto-js';
import { MessageInterface } from '../utils/types';

const P: bigint = BigInt(
    '0xFFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A63A36210000000000090563'
);
const g: bigint = BigInt(2);

export const DiffieHellmanService = {
    generateSecret(): bigint {
        const randomKey: bigint = BigInt(Math.floor(Math.random() * Number(P - g) + 1));
        return randomKey;
    },

    modularExponentiation(base: bigint, exponent: bigint, modulus: bigint): bigint {
        if (modulus === BigInt(1)) return BigInt(0);
        let result: bigint = BigInt(1);
        base = base % modulus;
        while (exponent > 0) {
            if (exponent % BigInt(2) === BigInt(1)) {
                result = (result * base) % modulus;
            }
            exponent = exponent >> BigInt(1); // Bit-shift right
            base = (base * base) % modulus;
        }
        return result;
    },

    generatePublicKey(secret: bigint): bigint {
        return this.modularExponentiation(g, secret, P);
    },

    generateSharedSecret(otherPartyPublicKey: string, ownPrivateKey: string): bigint | null {
        if (!otherPartyPublicKey || !ownPrivateKey) return null;
        return this.modularExponentiation(BigInt(otherPartyPublicKey), BigInt(ownPrivateKey), P);
    },

    handleGenerateKeys(): { secret: bigint; publicKey: string } {
        const secret: bigint = this.generateSecret();
        const publicKey: string = String(this.generatePublicKey(secret));
        console.log('Private Key (Secret):', secret.toString());
        console.log('Public Key:', publicKey);
        return { secret, publicKey };
    },

    encrypt(plainText: string, secretKey: string): string {
        const cipherText: string = CryptoJS.AES.encrypt(plainText, secretKey).toString();
        return cipherText;
    },

    decrypt(cipherText: string, secretKey: string): string {
        const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
        const plainText: string = bytes.toString(CryptoJS.enc.Utf8);
        return plainText;
    },

    decryptMessages(messages: MessageInterface[], secretKey: string): MessageInterface[] {
        const decryptedMessages = messages.map((msg) => {
            if (!msg.content) return { ...msg };
            msg.content = this.decrypt(msg.content, secretKey);
            return msg;
        });

        return decryptedMessages;
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
    },
};

export default DiffieHellmanService;
