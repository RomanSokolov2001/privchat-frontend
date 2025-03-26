import axios from "axios";
import { BASE_URL } from "../config";

axios.defaults.withCredentials = true;


export const AuthAPI = {
  async enterPool() {
    try {
      const userAgent = navigator.userAgent;
      const platform = navigator.platform;
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const language = navigator.language;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const dto = {userAgent: userAgent, platform: platform, screenHeight: screenHeight, screenWidth: screenWidth, language: language, timezone: timezone}

      const response = await axios.post(`${BASE_URL}/pool/enter`, dto, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response.data;
    } catch (e) {
      console.error('@enterPool:', e);
      throw e;
    }
  }
};
