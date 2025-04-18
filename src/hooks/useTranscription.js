import { useState } from "react";
import OpenAI from "openai";

export const useTranscription = () => {
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const transcribeAudio = async (audioBlob) => {
    if (!audioBlob) {
      setError("No audio to transcribe");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const file = new File([audioBlob], "audio.webm", { type: "audio/webm" });

      const response = await openai.audio.transcriptions.create({
        file: file,
        model: "whisper-1",
      });

      const transcriptionText = response.text;
      setTranscription(transcriptionText);
      return transcriptionText;
    } catch (err) {
      console.error("Error transcribing audio:", err);
      setError(`Transcription failed: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    transcription,
    loading,
    error,
    transcribeAudio,
    setTranscription,
  };
};

export default useTranscription;
