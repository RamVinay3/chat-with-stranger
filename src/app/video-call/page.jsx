import React from 'react'
import VideoCallInterface from './VideoInterface'

function VideoCall({intiateCall}) {
  return (
    <VideoCallInterface intiateCall={intiateCall} action={"videoCall"}/>
  )
}

export default VideoCall;