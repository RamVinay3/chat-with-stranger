'use client';
import { useSocketStore } from '@/sockets/socketStore';
import ToggleCall from '../components/ToggleCall';
import VideoCallInterface from '../video-call/VideoInterface';
import ChatBox from './ChatBox';

export default function ChatPage() {

  
  const { videoCallActive,videoCallStatus } =
      useSocketStore((state) => state);
    const { setVideoCallActive,setVideoCallStatus } = useSocketStore( (state) => state);

   const answerCall=()=>{
      console.log("call answering console.");
      setVideoCallStatus("in-call");
      setVideoCallActive(true);

    };
    const rejectCall=()=>{
      console.log("rejecting call console.");
      setVideoCallStatus("idle");
      setVideoCallActive(false);
    }
   
    return (
      <>
      {!videoCallActive && 
        <div className="chat-container">
        <ChatBox />
      </div> }
      {videoCallActive && videoCallStatus==='incoming-call' && <ToggleCall acceptCall={answerCall} rejectCall={rejectCall}/>}
      {videoCallActive && videoCallStatus==='in-call' && <VideoCallInterface  action="answerCall"/>}
      {videoCallActive && videoCallStatus==='intiating-call' && <VideoCallInterface intiateCall={true} action="intiatingCall" />}
      </>
    )
 
}
