"use client";
import { useEffect, useState, useRef } from "react";
import "./chat.css"; // Make sure this CSS file exists
import { useSocketStore } from "@/sockets/socketStore";
import {
  disconnectPartner,
  sendMessage,
  connectAnonymousChat,
  findNewPartner,
  initiateCall,
} from "@/sockets/socketActions";
import { Video , SendHorizontal, Mic,MicOff} from "lucide-react";
import { useRouter } from 'next/navigation';
import VideoCallInterface from "../video-call/VideoInterface";
import ToggleCall from "../components/ToggleCall";
import VoiceRecorder from "../components/VoiceRecorder";
import VoiceMessageChat from "../components/VoiceRecorder";

export default function ChatBox() {

  const { chatLog, status, message, partnerId, isFirstTime, socket,videoCallActive,showModal } =
    useSocketStore((state) => state);
  const { setChatLog, setStatus, setMessage, setPartnerId,setVideoCallActive,setVideoCallStatus } = useSocketStore(
    (state) => state
  );
  const chatEndRef = useRef(null);
  const messageTextField = useRef(null);
  const router=useRouter();
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  useEffect(() => {
    if (!socket) return;
    connectAnonymousChat({ socket });
  }, [socket]);
  useEffect(() => {
    messageTextField.current?.focus();
  }, [messageTextField]);
  
 
  return (
    <div className="chat-box">
      <div className="chat-header">
        <span>👤 {partnerId ? "Stranger" : "Waiting..."}</span>
        <div className="chat-header-options">
         {
          partnerId&&
          ( <div onClick={()=>{
           
            setVideoCallActive(true);
            setVideoCallStatus("intiating-call");
          }} disabled={!partnerId}>
          
            <Video size={30} color="white" />
          </div>
          )
         }
          <span className={`status ${partnerId ? "online" : "offline"}`}>
            ● {partnerId ? "Online" : "Offline"}
          </span>
        </div>
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
                  findNewPartner({
                    socket,
                    setChatLog,
                    setPartnerId,
                    setStatus,
                  });
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
          <div
           className={`send-button `}
          
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
           <SendHorizontal size={26} />
          </div>
          {!message && partnerId && !isRecording && <div className="mic-intial"><Mic /></div>}
          {!message && partnerId && isRecording && <div className="mic-off"><MicOff  /></div>}
          {/* <VoiceMessageChat socket={socket} toUsername={partnerId} /> */}
        </div>
      </div>
    </div>
  );
 
}
