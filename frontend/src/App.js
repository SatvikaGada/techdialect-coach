import React, { useEffect, useState } from 'react';
import AudioRecorder from './components/AudioRecorder';

function App() {
  const [question, setQuestion] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingTranscription, setLoadingTranscription] = useState(false);

  // Fetch a random question
  const fetchQuestion = async () => {
    setLoadingQuestion(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/question");
      const data = await response.json();
      setQuestion(data);
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      setLoadingQuestion(false);
    }
  };

  // On page load, fetch the first question
  useEffect(() => {
    fetchQuestion();
  }, []);

  // Handle audio transcription
  const handleAudioRecorded = async (audioBlob) => {
    setLoadingTranscription(true);
    setTranscript('');
    const formData = new FormData();
    formData.append("audio", audioBlob);

    try {
      const response = await fetch("http://127.0.0.1:8000/transcribe", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setTranscript(data.transcript);
    } catch (error) {
      console.error("Error during transcription:", error);
      setTranscript("Error during transcription.");
    } finally {
      setLoadingTranscription(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial', maxWidth: '700px', margin: 'auto' }}>
      <h1>TechDialect Coach</h1>

      {loadingQuestion ? (
        <p>Loading question...</p>
      ) : question ? (
        <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3>Interview Question</h3>
          <p><strong>Q:</strong> {question.question}</p>
          <p><strong>Expected Keywords:</strong> {question.keywords.join(', ')}</p>
          <p><strong>Difficulty:</strong> {question.difficulty}</p>
          <button onClick={fetchQuestion} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Next Question
          </button>
        </div>
      ) : (
        <p>No question available.</p>
      )}

      <AudioRecorder onAudioRecorded={handleAudioRecorded} />

      <h3>Transcript:</h3>
      {loadingTranscription ? <p>Transcribing...</p> : <p>{transcript}</p>}
    </div>
  );
}

export default App;
