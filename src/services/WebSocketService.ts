import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export const initializeWebSocket = (url: string, onMessageReceived: (msg: any) => void, nickname: string) => {
  const socket = new SockJS(`http://${url}:8080/ws`);
  const client = Stomp.over(socket);

  client.connect({}, () => {
    const sessionUrl = client.ws._transport.url;
    const sessionId = extractSessionId(sessionUrl);

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

const extractSessionId = (sessionUrl: string): string => {
  console.log(sessionUrl)
  const parts = sessionUrl.split('/');

  return `${parts[parts.length - 2]}`;
};
