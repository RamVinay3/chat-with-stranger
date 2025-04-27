import { create } from "zustand";

const useSoundStore = create((set) => ({
    messageSound:null,
    setMessageSound:(messageSound)=>set({messageSound}),
    callSound:null,
    setCallSound:(callSound)=>set({callSound}),
    notificationSound:null,
    setNotificationSound:(notificationSound)=>set({notificationSound})

}));