import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';

function App() {
  const [transcript, setTranscript] = useState('');

  const handleAudioRecorded = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob);

    const response = await fetch("http://127.0.0.1:8000/transcribe", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Transcript:", data.transcript);
    setTranscript(data.transcript);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>TechDialect Coach</h1>
      <p><strong>Question:</strong> Explain your final year project.</p>

      <AudioRecorder onAudioRecorded={handleAudioRecorded} />

      <h3>Transcript:</h3>
      <p>{transcript}</p>
    </div>
  );
}

export default App;
