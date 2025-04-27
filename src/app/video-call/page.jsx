"use client";
import useSocket from "@/sockets/sockets";
import { useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";
import "./video-call.css";
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff } from "lucide-react";

export default function VideoCallPage() {
  const { socket, partnerId } = useSocket();

  const [caller, setCaller] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [stream, setStream] = useState(null);
  const peerRef = useRef(null);

  const [callState, setCallState] = useState("idle");

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const localVideo = useRef();
  const remoteVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        localVideo.current.srcObject = currentStream;
      });

    if (!socket) return;

    socket.on("incoming-call", ({ from, signal }) => {
      setCallState("incoming-call");
      setCaller({ from, signal });
    });

    socket.on("call-answered", ({ signal }) => {
      setCallState("in-call");
      if (peerRef.current) {
        peerRef.current.signal(signal);
      } else {
        console.warn("peer is not ready yet");
      }
    });

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      socket.disconnect();
    };
  }, [socket]);

  const callUser = () => {
    const p = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
    });
    setCallState("intiated-call");
    p.on("signal", (signal) => {
      socket.emit("call-user", { to: partnerId, signal });
    });

    p.on("stream", (remoteStream) => {
      remoteVideo.current.srcObject = remoteStream;
    });

    peerRef.current = p;
  };

  const answerCall = () => {
    setCallState("in-call");
    setCallAccepted(true);

    const p = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
    });

    p.on("signal", (signal) => {
      socket.emit("answer-call", { to: partnerId, signal });
    });

    p.on("stream", (remoteStream) => {
      remoteVideo.current.srcObject = remoteStream;
    });

    p.signal(caller.signal);
    peerRef.current = p;
  };
  const endCall = () => {
    peerRef.current?.destroy();
    setCallAccepted(false);
    setCaller(null);
  };

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
          <div className="icon-wrapper icon-wrapper-intiate-call" onClick={callUser}>
            <Phone  className="icon-idle icon phone " />
          </div>
        )}
        {callState === "incoming-call" && (
          <div className="icon-wrapper icon-wrapper-answer-call" onClick={answerCall}>
            <Phone  className="answer-call icon  phone" />
          </div>
        )}
        {callState === "intiated-call" && (
          <div className="icon-wrapper  icon-wrapper-end-call" onClick={endCall} >
            <Phone className="icon phone icon-stop phone " />
          </div>
        )}
        {callState === "in-call" && (
          <>
            <div className="icon-wrapper icon-wrapper-end-call" onClick={endCall}>
            <Phone  className="icon phone icon-stop phone" />
            </div>
            {micOn ? (
              <div className="icon-wrapper start" onClick={toggleMic}>
                <Mic className=" icon icon-start "  />
              </div>
            ) : (
              <div className="icon-wrapper " onClick={toggleMic}>
                <MicOff className=" icon icon-stop"  />
              </div>
            )}
            {camOn ? (
              <div className="icon-wrapper" onClick={toggleCam}>
                <Video className="icon-start icon"  />
              </div>
            ) : (
              <div className="icon-wrapper" onClick={toggleCam}>
                <VideoOff className="icon-stop icon"  />
              </div>
            )}
          </>
        )}
        
      </div>
    </>
  );
}
