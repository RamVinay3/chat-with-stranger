import { useSocketStore } from "./socketStore";

// const socket = useSocketStore((state) => state.socket);
// const {setPartnerId,setChatLog,setStatus,setMessage} = useSocketStore((state) => state);
// const {partnerId,chatLog} = useSocketStore((state) => state);

// const getSocket = () => {
//   return socket;
// };

export function connectAnonymousChat({socket}) {
    console.log("Connecting to anonymous chat...",socket?.id);
     
    if(socket)
    socket.emit("link-anonymous-chat");

}
export function findNewPartner({socket}){
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
    // const {setChatLog,setStatus,setMessage} = useSocketStore((state) => state);
    // const {chatLog,partnerId,socket} = useSocketStore((state) => state);
    if (message.trim() && socket) {
        socket.emit("send-message", {
          message: message,
          receiverSocketId: partnerId,
          senderId: socket.id,
          senderUserName: "IamVinay",
          receiverUserName: receiverUserName
        });
        setChatLog( [...chatLog, { sender: "me", msg: message }]);
        setStatus("");
        setMessage("");
      }
  }
