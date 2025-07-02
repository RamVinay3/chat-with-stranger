import { create } from 'zustand';
import { io } from 'socket.io-client';

export const useSocketStore = create((set, get) => ({
  socket: null,
  partnerId:null,
  isFirstTime:true,
  status:"",
  chatLog:[],
  message: "",
  videoCallActive: false,
  showModal:false,
  videoCallStatus:"",
  caller:"",
  peer:null,
  pendingSignal:null,
  setPendingSignal:(val)=>set({pendingSignal:val}),
  setPeer:(val)=>set({peer:val}),
  setCaller:(val)=>set({ caller: val }),
  setVideoCallStatus: (videoCallStatus) => set({ videoCallStatus }),
  setShowModal:(val)=> set({ showModal: val }),
  setVideoCallActive: (val) => set({ videoCallActive: val }),
  setMessage: (message) => set({ message }),
  setChatLog: (chatLog) => set({ chatLog }),
  setStatus: (status) => set({ status }),
  setIsFirstTime: (isFirstTime) => set({ isFirstTime }),
  setPartnerId: (partnerId) => set({ partnerId }),
  connect: () => {
    // const socket= io("http://localhost:4567");
    const socket= io("http://192.168.1.18:4567");
   
    socket.on('connect', () => {
      console.log('Connected:', socket.id);
     let username = sessionStorage.getItem("username");
      socket.emit('register_user',username);
       set({ socket });//we did set after registering it
    });

    socket.on('disconnect', () => {
      get().setPartnerId(null);
      // get().setChatLog([...get().chatLog, { sender: "system", msg: "Partner got disconnected" }]);
      
    });

    
    socket.on("partner-found", (partnerUserId) => {
        console.log("Partner found:", partnerUserId);
        get().setPartnerId(partnerUserId);
        set({ isFirstTime: false });
        get().setChatLog([]);
        get().setStatus("");
      });
      socket.on("partner-disconnected", () => {
        get().setPartnerId(null);
        get().setChatLog([...get().chatLog, { sender: "system", msg: "Partner got disconnected" }]);
       
      });
    
      socket.on("disconnect-partner", () => {
        console.log("Disconnecting partner");
      }
      );
      socket.on("receive-message", (obj) => {
        console.log("Received message:",  obj.message);
        const audio = new Audio("/audiofiles/message.mp3");
        try{
            audio.play();
        }
        catch(err){
          console.log(err);
        }
        
        set((state) => ({
          chatLog: [...state.chatLog, { sender: "partner", msg:  obj.message }],
        }));
      });
      socket.on('answer-call', ({data,callerUserName,callerSocketId}) =>{
        get().setVideoCallStatus("in-call");
        console.log("Answer call",data,callerUserName,callerSocketId);
      } );
      
      socket.on('incoming-call',(data)=>{
        const audio = new Audio("/audiofiles/ringtone.mp3");
        get().setVideoCallActive(true);
        get().setVideoCallStatus("incoming-call");
        console.log("Incoming call",data);
        get().setCaller(data);
      })

    socket.on("call-answered", ({ signal }) => {
      console.log("call answered", signal);
     get().setVideoCallStatus("in-call");
     const peer = get().peer;
    if (peer) {
      if (peer._pc.signalingState === "stable") {
        console.warn("Skipping signal: already stable");
      } else {
        peer.signal(signal);
      }
    } else {
      console.warn("peer is not ready yet — queuing signal");
      get().setPendingSignal(signal); // handle this later when peer is ready
    }
    });
  },
  
  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
