import { useEffect } from 'react';
import { useSocketStore } from './socketStore';
 // adjust path if needed

export default function useSocket(eventName, callback) {
  const socket = useSocketStore((state) => state.socket);

  useEffect(() => {
    if (!socket) return;

    socket.on(eventName, callback);

    // Clean up when component unmounts or socket changes
    return () => {
      socket.off(eventName, callback);
    };
  }, [socket, eventName, callback]);

  return socket; // return socket if you need to emit events
}
