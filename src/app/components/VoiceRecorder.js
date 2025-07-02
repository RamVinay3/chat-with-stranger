import { useSocketStore } from '@/sockets/socketStore';
import React, { useRef, useState, useEffect } from 'react';

export default function VoiceMessageChat({ socket, toUsername, myUsername }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [receivedVoiceMessages, setReceivedVoiceMessages] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  

  // 🎤 Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        const reader = new FileReader();
        reader.onloadend = () => {
          socket.emit('voiceMessage', {
            from: myUsername,
            to: toUsername,
            audioData: reader.result, // base64 string
          });
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone error:', err);
    }
  };

  // ⏹️ Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // // 🔊 Handle incoming voice message
  // useEffect(() => {
  //   socket.on('voiceMessage', (data) => {
  //     if (data.from !== myUsername) {
  //       setReceivedVoiceMessages((prev) => [
  //         ...prev,
  //         { from: data.from, audioData: data.audioData },
  //       ]);
  //     }
  //   });

  //   return () => socket.off('voiceMessage');
  // }, [socket, myUsername]);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Voice Chat</h2>

      {/* 🎙️ Recorder UI */}
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        style={{
          ...styles.recordButton,
          backgroundColor: isRecording ? '#ef4444' : '#3b82f6',
        }}
      >
        {isRecording ? 'Recording...' : 'Hold to Record'}
      </button>

      {/* ▶️ Playback own recording */}
      {audioURL && (
        <div style={styles.myMessage}>
          <strong>You:</strong>
          <audio controls src={audioURL} />
        </div>
      )}

      {/* 📥 List of received voice messages */}
      {receivedVoiceMessages.map((msg, idx) => (
        <div key={idx} style={styles.receivedMessage}>
          <strong>{msg.from}:</strong>
          <audio controls src={msg.audioData} />
        </div>
      ))}
    </div>
  );
}

// 🎨 Simple styles
const styles = {
  container: {
    padding: '1rem',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '500px',
    margin: 'auto',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
  },
  header: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  recordButton: {
    padding: '10px 20px',
    borderRadius: '9999px',
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  },
  myMessage: {
    marginTop: '1rem',
    padding: '0.5rem',
    backgroundColor: '#e0f2fe',
    borderRadius: '6px',
  },
  receivedMessage: {
    marginTop: '0.75rem',
    padding: '0.5rem',
    backgroundColor: '#fef3c7',
    borderRadius: '6px',
  },
};
