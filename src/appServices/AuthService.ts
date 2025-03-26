import {AuthAPI} from "../api/AuthAPI";
import DiffieHellmanService from "../services/DiffieHellmanService";
import {User} from "../utils/types";
import React from "react";

class AuthService {
    async handleLogin(setUser: (user: User) => void) {
        try {
            const credentials = await AuthAPI.enterPool();
            const {publicKey, secret} = DiffieHellmanService.handleGenerateKeys();
            setUser({
                jwt: credentials.token,
                nickname: credentials.nickname,
                publicKey,
                secretKey: String(secret),
                expiresIn: credentials.expiresIn
            });
        } catch (error) {
            console.error('@handleLogin:', error);
            throw error;
        }
    }

    async acceptInvite(invitationCode: string, setUser: (user: User) => void) {
        const credentials = await AuthAPI.enterPool();
        const { publicKey, secret } = DiffieHellmanService.handleGenerateKeys();

        setUser({
            jwt: credentials.token,
            nickname: credentials.nickname,
            publicKey,
            secretKey: String(secret),
            expiresIn: credentials.expiresIn,
            invitationLink: invitationCode
        });
    }
}

export const authService = new AuthService();
