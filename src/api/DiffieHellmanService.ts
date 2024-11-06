import * as CryptoJS from 'crypto-js'
import { Message } from '../types';


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

    decryptMessages(messages: Message[], secretKey: string) {
        const decryptedMessages = messages.map((msg) => {
            msg.content = this.decrypt(msg.content, secretKey)
            return msg
        })

        return decryptedMessages
    }
}

export default DiffieHellmanService;