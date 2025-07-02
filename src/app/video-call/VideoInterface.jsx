"use client";
// import useSocket from "@/sockets/sockets";
import { useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";
import "./video-call.css";
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff } from "lucide-react";
import { useSocketStore } from "@/sockets/socketStore";
import { callUser, answerCall } from "@/sockets/socketActions";
export default function VideoCallInterface({ intiateCall, action }) {
  const {
    socket,
    partnerId,
    videoCallStatus: callState,
    setVideoCallStatus: setCallState,
    setCaller,
    setPeer,
    caller,
    endCall
  } = useSocketStore((state) => state);

  const [stream, setStream] = useState(null);
  const peerRef = useRef(null);

  

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const localVideo = useRef();
  const remoteVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (localVideo.current) localVideo.current.srcObject = currentStream;
      });
  }, []);

  useEffect(() => {
    console.log("action", action);
    if(!stream || !remoteVideo)return;
    if (action == "intiatingCall") {
      callUser({
        socket,
        setCallState,
        stream,
        remoteVideo,
        partnerId,
        setPeer,
        SimplePeer
      });
    } else if (action == "answerCall") {
      if(!remoteVideo)return;
      answerCall({
        socket,
        setCallState,
        stream,
        remoteVideo,
        caller,
        partnerId,
        setPeer,
        SimplePeer
      });
    }
  }, [action,remoteVideo,stream]);
  useEffect(()=>{
    console.log(remoteVideo,"remote video");
    console.log(localVideo,"local-video");
  },[remoteVideo,localVideo])
  const toggleMic = () => {
    stream.getAudioTracks()[0].enabled = !micOn;
    setMicOn(!micOn);
  };

  const toggleCam = () => {
    stream.getVideoTracks()[0].enabled = !camOn;
    setCamOn(!camOn);
  };

  return (
    <>
      <video
        ref={localVideo}
        autoPlay
        playsInline
        muted
        className="video-box"
      />
      <video ref={remoteVideo} autoPlay playsInline className="video-box" />

      <div className="controls-overlay">
        {callState === "idle" && (
          <div
            className="icon-wrapper icon-wrapper-intiate-call"
            onClick={callUser}
          >
            <Phone className="icon-idle icon phone " />
          </div>
        )}
        {callState === "incoming-call" && (
          <div
            className="icon-wrapper icon-wrapper-answer-call"
            onClick={answerCall}
          >
            <Phone className="answer-call icon  phone" />
          </div>
        )}
        {callState === "intiating-call" && (
          <div
            className="icon-wrapper  icon-wrapper-end-call"
            onClick={endCall}
          >
            <Phone className="icon phone icon-stop phone " />
          </div>
        )}
        {callState === "in-call" && (
          <>
            <div
              className="icon-wrapper icon-wrapper-end-call"
              onClick={endCall}
            >
              <Phone className="icon phone icon-stop phone" />
            </div>
            {micOn ? (
              <div className="icon-wrapper start" onClick={toggleMic}>
                <Mic className=" icon icon-start " />
              </div>
            ) : (
              <div className="icon-wrapper " onClick={toggleMic}>
                <MicOff className=" icon icon-stop" />
              </div>
            )}
            {camOn ? (
              <div className="icon-wrapper" onClick={toggleCam}>
                <Video className="icon-start icon" />
              </div>
            ) : (
              <div className="icon-wrapper" onClick={toggleCam}>
                <VideoOff className="icon-stop icon" />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
