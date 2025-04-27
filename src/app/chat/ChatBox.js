"use client";
import { useEffect, useState, useRef } from "react";
import useSocket from "../../sockets/sockets";
import "./chat.css"; // Make sure this CSS file exists
import { useSocketStore } from "@/sockets/socketStore";
import {
  disconnectPartner,
  sendMessage,
  connectAnonymousChat,
  findNewPartner,
} from "@/sockets/socketActions";

export default function ChatBox() {
  const { chatLog, status, message, partnerId, isFirstTime, socket } =
    useSocketStore((state) => state);
  const { setChatLog, setStatus, setMessage } = useSocketStore(
    (state) => state
  );
  const chatEndRef = useRef(null);
  const messageTextField = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  useEffect(() => {
    if (!socket) return;
    connectAnonymousChat({ socket });
  }, [socket]);
  useEffect(() => {
    messageTextField.current?.focus();
  }, []);

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
        {(partnerId || !isFirstTime) && (
          <div className="chat-options">
            {partnerId && (
              <button
                onClick={() => {
                  disconnectPartner({ setPartnerId, socket });
                }}
              >
                End Chat
              </button>
            )}
            {!isFirstTime && (
              <button
                onClick={() => {
                  findNewPartner({ socket });
                }}
              >
                New chat
              </button>
            )}
          </div>
        )}
        <div className="chat-input-bar">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            disabled={!partnerId}
            ref={messageTextField}
          />
          <button
            onClick={() => {
              sendMessage({
                message,
                setChatLog,
                setStatus,
                setMessage,
                chatLog,
                partnerId,
                socket,
              });
            }}
            disabled={!partnerId}
          >
            📩
          </button>
        </div>
      </div>
    </div>
  );
}
