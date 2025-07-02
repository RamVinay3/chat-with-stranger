'use client';
import React from 'react'
import './toggleCall.css';
import { Phone,PhoneOff } from 'lucide-react';
function ToggleCall({name,rejectCall,acceptCall}) {
  return (
  
   
        <div className="incoming-call-modal">
          <div className="caller-name">{  "Incoming Call from Stranger"}</div>
      
          <div className="call-actions">
            <div className="icon accept-call" onClick={ acceptCall} >
              <Phone className="green-phone"  />
            </div>
            <div className="icon reject-call" onClick={rejectCall}>
              <PhoneOff className="red-phone"  />
            </div>
          </div>
        </div>
     
      
      
      
  )
}

export default ToggleCall;