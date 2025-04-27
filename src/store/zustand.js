import { create } from 'zustand'

const useStore=create((set)=>({
    userDetails:null,
    setUserDetails:(userDetails)=>set({userDetails}),
    sessionId:null,
    setSessionId:(sessionId)=>set({sessionId}),
    chats:[],
    setChats:(chats)=>set({chats}),
    anonymousChatLog:[],
    setAnonymousChatLog:(anonymousChatLog)=>set({anonymousChatLog})

}));