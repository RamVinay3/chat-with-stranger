"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function useSocket() {
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [partnerId, setPartnerId] = useState(null);
  const [status, setStatus] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(true);
  //for chat box
  const [chatLog, setChatLog] = useState([]);
  const [message, setMessage] = useState("");
  //for chat box;
  

  const sendMessage = () => {
    if (message.trim() && socket.current) {
      socket.current.emit("send-message", {
        message: message,
        receiverId: partnerId,
        senderId: socket.current.id,
      });
      setChatLog((prev) => [...prev, { sender: "me", msg: message }]);
      setMessage("");
      setStatus("");
    }
  };

  const findNewPartner = () => {
    if (socket.current) {
      socket.current.emit("find-new-partner");
      setChatLog([]);
      setPartnerId(null);
      setStatus("Finding a new partner...");
    }
  };
  const disconnectPartner = () => {
    if (socket.current) {
      socket.current.emit("disconnect-partner");

      setStatus("Disconnected from partner");
      setPartnerId(null);
    }
  };
  const receiveMessage = () => {
    if(socket.current){
      socket.current.on("receive-message", (obj) => {
        setChatLog((prev) => [...prev, { sender: "partner", msg: obj.message }]);
        setStatus("");
      });
      // return () => {
      //   socket.current.off("receive-message");
      // };
    }
};

  useEffect(() => {
    socket.current = io("http://localhost:4567");

    socket.current.on("connect", () => {
      console.log("Connected to server:", socket.current.id);
      setIsConnected(true);
      setStatus("Connecting to a stranger...");
    });

    socket.current.on("partner-found", (partnerSocketId) => {
      console.log("Partner found:", partnerSocketId);
      setPartnerId(partnerSocketId);
      setStatus("connected to a stranger");
    });
    socket.current.on("partner-disconnected", () => {
      setPartnerId(null);
      setStatus("Partner got disconnected ,please try again");
    });
    socket.current.on("disconnect", () => {
      console.log("Disconnected");
      setIsConnected(false);
      setPartnerId(null);
    });

    socket.current.on("partner-found", (partnerSocketId) => {
      console.log("Partner found:", partnerSocketId);
      setPartnerId(partnerSocketId);
      setIsFirstTime(false);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);
  useEffect(() => {
    // const cleanup=receiveMessage();
    // return cleanup;
    receiveMessage();
  },[]);

  return {
    socket: socket.current,
    isConnected,
    partnerId,
    status,
    sendMessage,
    findNewPartner,
    disconnectPartner,
    chatLog,
    message,
    receiveMessage,
    setMessage,
    isFirstTime
  };
}
