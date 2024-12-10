import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export const initializeWebSocket = (url: string, onMessageReceived: (msg: any) => void, nickname: string) => {
  const socket = new SockJS(`http://${url}/ws`);
  const client = Stomp.over(socket);

  client.connect({}, () => {
    const sessionId = extractSessionId(client.ws._transport.url);
    client.subscribe(`/queue/specific-user-${sessionId}`, (msg) => {
      onMessageReceived(JSON.parse(msg.body));
    });
    client.send('/app/chat.addUser', {}, nickname);
  });

  return client;
};

export const disconnectWebSocket = (client: any) => {
  if (client) {
    client.disconnect();
  }
};

const extractSessionId = (url: string): string => {
  return url.replace(`ws://${url}/ws/`, '')
            .replace('/websocket', '')
            .replace(/^[0-9]+\//g, '');
};
