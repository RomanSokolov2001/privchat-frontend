import { ChatInterface } from "./types"

export function getOpponentNickname(user: any, chat: ChatInterface | null) {
  if (!chat) return "error"
  if (user?.nickname == chat.requesterNickname) return chat.requestedNickname
  else { return chat.requesterNickname }
}

export function getOpponentPublicKey(user: any, chat: ChatInterface) {
  if (user?.publicKey == chat.requesterPublicKey) return chat.requestedPublicKey
  else { return chat.requesterPublicKey }
}

export function timeAgo(date: string): string {
  const dateObject = new Date(date);
  const seconds = Math.floor((new Date().getTime() - dateObject.getTime()) / 1000);
  const interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years ago";
  }
  if (interval === 1) {
    return interval + " year ago";
  }

  const months = Math.floor(seconds / 2628000);
  if (months > 1) {
    return months + " months ago";
  }
  if (months === 1) {
    return months + " month ago";
  }

  const days = Math.floor(seconds / 86400);
  if (days > 1) {
    return days + " days ago";
  }
  if (days === 1) {
    return days + " day ago";
  }

  const hours = Math.floor(seconds / 3600);
  if (hours > 1) {
    return hours + " hours ago";
  }
  if (hours === 1) {
    return hours + " hour ago";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes > 1) {
    return minutes + " minutes ago";
  }
  if (minutes === 1) {
    return minutes + " minute ago";
  }

  return "just now";
}

export function getStringFromMs(ms: any) {
  const timeOptions = [
    { value: 1, unit: 'second', ms: 1000 },
    { value: 5, unit: 'seconds', ms: 5000 },
    { value: 10, unit: 'seconds', ms: 10000 },
    { value: 15, unit: 'seconds', ms: 15000 },
    { value: 30, unit: 'seconds', ms: 30000 },
    { value: 1, unit: 'minute', ms: 60000 },
    { value: 2, unit: 'minutes', ms: 120000 },
    { value: 5, unit: 'minutes', ms: 300000 },
    { value: 10, unit: 'minutes', ms: 600000 },
    { value: 30, unit: 'minutes', ms: 1800000 },
    { value: 1, unit: 'hour', ms: 3600000 },
  ];

  var formattedTime = "error"

  timeOptions.map((e)=> {
    if (e.ms == Number(ms)) {
      formattedTime = `${String(e.value)} ${e.unit}`
    }
  })

  return formattedTime
}

export function generateRandomId(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';
  for (let i = 0; i < length; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomId;
}

export function getFileNameWithoutExtension(filename: string): string {
  const noExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
    const underscoreIndex = noExt.indexOf('_');

    return underscoreIndex >= 0 ? noExt.substring(underscoreIndex + 1) : noExt;
}
