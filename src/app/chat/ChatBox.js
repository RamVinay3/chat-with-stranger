"use client";
import { useEffect, useState, useRef } from "react";
import useSocket from "../../sockets/sockets";
import "./chat.css"; // Make sure this CSS file exists

export default function ChatBox() {
  const {
    socket,
    isConnected,
    partnerId,
    status,
    chatLog,
    message,
    disconnectPartner,
    findNewPartner,
    sendMessage,
    receiveMessage,
    setMessage,
    isFirstTime
  } = useSocket();

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);
  // useEffect(() => {
  //  receiveMessage();
  // }, [socket]);

  return (
    <div className="chat-box">
      <div className="chat-header">
        <span>👤 {partnerId ? "Stranger" : "Waiting..."}</span>
        <span className={`status ${partnerId ? "online" : "offline"}`}>
          ● {partnerId ? "Online" : "Offline"}
        </span>
      </div>

      <div className="chat-messages">
        {chatLog.map((c, i) => (
          <div key={i} className={`message ${c.sender}`}>
            {c.msg}
          </div>
        ))}
        <div className="error-msg">{status}</div>
        <div ref={chatEndRef} />
      </div>
      <div className="chat-features">
     { (partnerId || !isFirstTime) && <div className="chat-options">
      {partnerId &&  <button onClick={disconnectPartner} >End Chat</button>}
      {!isFirstTime && <button onClick={findNewPartner}>New chat</button>} 
      </div>
}
      <div className="chat-input-bar">
       
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          disabled={!partnerId}
        />
        <button onClick={sendMessage} disabled={!partnerId}>
          📩
        </button>
      </div>
      </div>
    </div>
  );
}
