import { useSocketStore } from "./socketStore";



export function connectAnonymousChat({socket}) {
     
    if(socket)
    socket.emit("link-anonymous-chat");

}
export function findNewPartner({socket,setChatLog,setPartnerId,setStatus}){
    if (socket) {
        socket.emit("find-new-partner");
        setChatLog([]);
        setPartnerId(null);
        setStatus("Finding a new partner...");
      }
}
  export function disconnectPartner({setPartnerId,socket}){
    if(socket)
    socket.emit("disconnect-partner");
    setPartnerId(null);

  }
  export function sendMessage({message,setChatLog,setStatus,setMessage,chatLog,partnerId,socket,receiverUserName=null}){
   
    if (message.trim() && socket) {

        socket.emit("send-message", {
          
          message: message,
          senderUserName: sessionStorage.getItem('username') || "IamVinay",
          receiverUserName: partnerId
        });
        setChatLog( [...chatLog, { sender: "me", msg: message }]);
        setStatus("");
        setMessage("");
      }
  }
  export function callUser({socket,setCallState,stream,remoteVideo,partnerId,setPeer,SimplePeer}){
    console.log("calling other user for video call");
        const p = new SimplePeer({
          initiator: true,
          trickle: false,
          stream,
        });
        setCallState("intiating-call");
        p.on("signal", (signal) => {
          socket.emit("call-user", { signal,receiverUserName:partnerId });
        });
    
        p.on("stream", (remoteStream) => {
           console.log(remoteStream,"remote stream in call - User");
          if(remoteVideo.current)remoteVideo.current.srcObject = remoteStream;
        });
    
        setPeer(p);

  }
  export function answerCall({socket,setCallState,stream,remoteVideo,caller,partnerId,setPeer,SimplePeer}){
    console.log("answering call from other user");
    setCallState("in-call");
    
    const p = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
    });

    p.on("signal", (signal) => {
      socket.emit("answer-call", { receiverUserName: partnerId, signal });
    });

    p.on("stream", (remoteStream) => {
      console.log(remoteStream,"remote stream in answerCall");
      if(remoteVideo.current)remoteVideo.current.srcObject = remoteStream;
    });
    if(!caller?.signal){
      console.log("caller signal not found now");
      return;
    }
    p.signal(caller.signal);
    
    setPeer(p);
  }
 
  export function endCall ({peer,setCaller}) {
   peer?.destroy();
    setCaller(null);
  };
  export function saveToMapping({socket,username}){

    if(socket){
      socket.emit('save-mapping-socket-to-user',{
        userName:username
      });
    }



  }