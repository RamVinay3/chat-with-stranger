import { create } from 'zustand';
import { io } from 'socket.io-client';

export const useSocketStore = create((set, get) => ({
  socket: null,
  partnerId:null,
  isFirstTime:true,
  status:"",
  chatLog:[],
  message: "",
  setMessage: (message) => set({ message }),
  setChatLog: (chatLog) => set({ chatLog }),
  setStatus: (status) => set({ status }),
  setIsFirstTime: (isFirstTime) => set({ isFirstTime }),
  setPartnerId: (partnerId) => set({ partnerId }),
  connect: () => {
    const socket= io("http://localhost:4567");
    set({ socket });

    socket.on('connect', () => {
      console.log('Connected:', socket.id);
      socket.emit('register_user',{username:"Anonymous"});
    });

    socket.on('disconnect', () => {
      get().setPartnerId(null);
      get().setChatLog([...get().chatLog, { sender: "system", msg: "Partner got disconnected" }]);
      console.log('Disconnected');
    });

    
    socket.on("partner-found", (partnerSocketId) => {
        console.log("Partner found:", partnerSocketId);
        get().setPartnerId(partnerSocketId);
        set({ isFirstTime: false });
      });
      socket.on("partner-disconnected", () => {
        get().setPartnerId(null);
       console.log("Partner got disconnected");
      });
    //   socket.on("link-anonymous-chat",()=>{
    //     console.log("Linking anonymous chat");
    //   });
    //   socket.on("link-anonymous-call",()=>{
    //     console.log("Linking anonymous call");
    //   });
      socket.on("find-new-partner", () => {
        console.log("Finding new partner");
      });
      socket.on("disconnect-partner", () => {
        console.log("Disconnecting partner");
      }
      );
      socket.on("receive-message", (obj) => {
        console.log("Received message:",  obj.message);
        const audio = new Audio("/audiofiles/message.mp3");
        audio.play();
        set((state) => ({
          chatLog: [...state.chatLog, { sender: "partner", msg:  obj.message }],
        }));
      });
    //   socket.on('call-user', ({data,receiverUserName,receiverSocketId}) =>{
    //     console.log("Call user",data,receiverUserName,receiverSocketId);
    //   });
      socket.on('answer-call', ({data,callerUserName,callerSocketId}) =>{
        console.log("Answer call",data,callerUserName,callerSocketId);
      } );
  },
  
  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
