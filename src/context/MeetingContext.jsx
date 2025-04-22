import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactMediaRecorder } from "react-media-recorder";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../firebase/config";
import { useAuth } from "./AuthContext";
import { transcribeAudio, generateMinutes } from "../services/openai";

const MeetingContext = createContext();

export const useMeeting = () => {
  return useContext(MeetingContext);
};

function MeetingProviderComponent({ children }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [minutes, setMinutes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingMinutes, setIsGeneratingMinutes] = useState(false);
  const [error, setError] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [currentMeeting, setCurrentMeeting] = useState(null);

  const {
    status,
    startRecording: startMediaRecorder,
    stopRecording: stopMediaRecorder,
    previewStream,
    clearBlobUrl,
  } = useReactMediaRecorder({
    audio: true,
    video: false,
    onStop: (blobUrl, blob) => {
      saveAudioBlob(blob);
    },
    onStart: () => {
      setError(null);
    },
    onError: (err) => {
      console.error("CONTEXT/onError: react-media-recorder Error:", err);
      setError(
        `Recording Error: ${err.message || err.name
        }. Please ensure microphone access is granted.`
      );
    },
  });

  const isRecording = status === "recording";

  const saveAudioBlob = (blob) => {
    setAudioBlob(blob);
  };

  const startMeeting = () => {
    if (isRecording) {
      return;
    }
    setError(null);
    setAudioBlob(null);
    setTranscription("");
    setMinutes(null);
    setIsTranscribing(false);
    setIsGeneratingMinutes(false);
    clearBlobUrl();

    startMediaRecorder();
  };

  const endMeeting = () => {
    if (!isRecording) {
      return;
    }
    stopMediaRecorder();
  };

  const transcribeMeetingAudio = async () => {
    if (!audioBlob) {
      console.error("CONTEXT/transcribeMeetingAudio: No audioBlob found.");
      setError("No recording available to transcribe.");
      return false;
    }
    if (transcription) {
      return true;
    }

    setLoading(true);
    setIsTranscribing(true);
    setError(null);

    try {
      const transcript = await transcribeAudio(audioBlob);
      if (!transcript && transcript !== "") {
        throw new Error("Transcription result was empty or invalid.");
      }

      setTranscription(transcript);
      setIsTranscribing(false);
      setLoading(false);
      return true;
    } catch (err) {
      console.error(
        "CONTEXT/transcribeMeetingAudio: Failed to transcribe audio:",
        err
      );
      setError(`Transcription failed: ${err.message}`);
      setIsTranscribing(false);
      setLoading(false);
      return false;
    }
  };

  const generateAndSaveMeeting = async (title = "Untitled Meeting") => {
    if (!audioBlob || !currentUser) {
      console.error(
        "CONTEXT/generateAndSaveMeeting: Missing audioBlob or currentUser."
      );
      setError("No recording available or user not logged in");
      return null;
    }
    if (!transcription) {
      console.error("CONTEXT/generateAndSaveMeeting: Missing transcription.");
      setError("Transcription must be completed before generating minutes.");
      return null;
    }

    setLoading(true);
    setIsGeneratingMinutes(true);
    setError(null);

    const processingTimeout = setTimeout(() => {
      if (isGeneratingMinutes || loading) {
        console.warn(
          "CONTEXT/generateAndSaveMeeting: Processing timed out after 3 minutes."
        );
        setLoading(false);
        setIsGeneratingMinutes(false);
        setError("Processing took too long and timed out. Please try again.");
      }
    }, 180000);

    let audioUrl = null;
    let generatedMinutesData = minutes;
    let meetingId = null;

    try {
      if (
        !generatedMinutesData ||
        (generatedMinutesData && generatedMinutesData.error)
      ) {
        try {
          generatedMinutesData = await generateMinutes(transcription, title);

          if (generatedMinutesData && generatedMinutesData.error) {
            console.error(
              "CONTEXT/generateAndSaveMeeting: Minutes generation resulted in an error state:",
              generatedMinutesData.error
            );
            setError(
              `Minutes Generation Failed: ${generatedMinutesData.error}`
            );
          } else if (!generatedMinutesData) {
            throw new Error(
              "Minutes generation result was empty or undefined."
            );
          }
          setMinutes(generatedMinutesData);
        } catch (minutesError) {
          console.error(
            "CONTEXT/generateAndSaveMeeting: Failed during minutes generation call:",
            minutesError
          );
          setError(`Minutes generation failed: ${minutesError.message}`);
          setIsGeneratingMinutes(false);
          setLoading(false);
          clearTimeout(processingTimeout);
          return null;
        }
      } else {
        console.log(
          "CONTEXT/generateAndSaveMeeting: Step 1 - Skipping minutes generation (already have valid data)."
        );
      }
      setIsGeneratingMinutes(false);

      const meetingStatus =
        generatedMinutesData && !generatedMinutesData.error
          ? "completed"
          : "completed_partial";
      const hasValidMinutes =
        generatedMinutesData && !generatedMinutesData.error;

      const meetingData = {
        title,
        status: meetingStatus,
        creatorName: currentUser.displayName || "Unknown User",
        creatorEmail: currentUser.email,
        userId: currentUser.uid,
        hasTranscription: true,
        hasMinutes: hasValidMinutes,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const meetingsRef = collection(db, "meetings");
      const docRef = await addDoc(meetingsRef, meetingData);
      meetingId = docRef.id;

      const audioPath = `recordings/${currentUser.uid}/${meetingId}/audio.webm`;
      const audioRef = ref(storage, audioPath);
      await uploadBytes(audioRef, audioBlob);
      audioUrl = await getDownloadURL(audioRef);

      const minutesToStore = {
        ...(generatedMinutesData || { error: "Minutes data unavailable." }),
        transcription: transcription,
        audioUrl: audioUrl,
      };
      const minutesPath = `minutes/${currentUser.uid}/${meetingId}/minutes.json`;
      const minutesRef = ref(storage, minutesPath);
      const jsonBlob = new Blob([JSON.stringify(minutesToStore, null, 2)], {
        type: "application/json",
      });
      await uploadBytes(minutesRef, jsonBlob);
      const minutesUrl = await getDownloadURL(minutesRef);

      const meetingRef = doc(db, "meetings", meetingId);
      await updateDoc(meetingRef, {
        audioUrl,
        minutesUrl,
        updatedAt: serverTimestamp(),
      });

      clearTimeout(processingTimeout);
      setLoading(false);
      navigate(`/meeting/${meetingId}`);
      return meetingId;
    } catch (err) {
      console.error(
        "CONTEXT/generateAndSaveMeeting: Error during Firebase storage/update:",
        err
      );
      setError(`Error saving results: ${err.message}`);
      if (meetingId) {
        try {
          const meetingRef = doc(db, "meetings", meetingId);
          await updateDoc(meetingRef, {
            status: "failed",
            error: `Save failed: ${err.message}`,
            updatedAt: serverTimestamp(),
          });
        } catch (updateError) {
          console.error(
            "CONTEXT: Failed to update meeting status to failed:",
            updateError
          );
        }
      }
      clearTimeout(processingTimeout);
      setIsGeneratingMinutes(false);
      setLoading(false);
      return null;
    }
  };

  const loadUserMeetings = async () => {
    if (!currentUser) {
      setMeetings([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const meetingsRef = collection(db, "meetings");
      const q = query(meetingsRef, where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const userMeetings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      userMeetings.sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );

      setMeetings(userMeetings);
    } catch (err) {
      console.error("CONTEXT/loadUserMeetings: Error:", err);
      setError(`Error loading meetings: ${err.message}`);
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMeeting = async (meetingId) => {
    if (!currentUser || !meetingId) return null;
    setLoading(true);
    setError(null);
    setCurrentMeeting(null);
    try {
      const meetingRef = doc(db, "meetings", meetingId);
      const meetingSnap = await getDoc(meetingRef);
      if (
        !meetingSnap.exists() ||
        meetingSnap.data().userId !== currentUser.uid
      ) {
        throw new Error("Meeting not found or access denied.");
      }
      const meetingData = { id: meetingSnap.id, ...meetingSnap.data() };
      if (meetingData.minutesUrl) {
        try {
          const response = await fetch(meetingData.minutesUrl);
          if (!response.ok)
            throw new Error(
              `Failed to fetch minutes (Status: ${response.status})`
            );
          meetingData.minutesData = await response.json();
        } catch (fetchError) {
          console.error(
            "CONTEXT/loadMeeting: Error fetching minutes data:",
            fetchError
          );
          setError(`Failed to load minutes details: ${fetchError.message}`);
          meetingData.minutesData = {
            error: "Could not load minutes details.",
          };
        }
      } else {
        meetingData.minutesData = null;
      }
      setCurrentMeeting(meetingData);
      return meetingData;
    } catch (err) {
      console.error("CONTEXT/loadMeeting: Error loading meeting:", err);
      setError(`Error loading meeting: ${err.message}`);
      setCurrentMeeting(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeMeeting = async (meetingId) => {
    if (!currentUser || !meetingId) return false;
    setLoading(true);
    setError(null);
    try {
      const meetingRef = doc(db, "meetings", meetingId);
      const meetingSnap = await getDoc(meetingRef);
      if (
        !meetingSnap.exists() ||
        meetingSnap.data().userId !== currentUser.uid
      ) {
        throw new Error("Meeting not found or permission denied.");
      }
      const audioPath = `recordings/${currentUser.uid}/${meetingId}/audio.webm`;
      const minutesPath = `minutes/${currentUser.uid}/${meetingId}/minutes.json`;
      try {
        await deleteObject(ref(storage, audioPath));
      } catch (e) {
        if (e.code !== "storage/object-not-found")
          console.warn("Audio delete failed:", e.message);
      }
      try {
        await deleteObject(ref(storage, minutesPath));
      } catch (e) {
        if (e.code !== "storage/object-not-found")
          console.warn("Minutes delete failed:", e.message);
      }
      await deleteDoc(meetingRef);
      setMeetings((prev) => prev.filter((m) => m.id !== meetingId));
      if (currentMeeting?.id === meetingId) setCurrentMeeting(null);
      return true;
    } catch (err) {
      console.error("CONTEXT/removeMeeting: Error deleting meeting:", err);
      setError(`Error deleting meeting: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    mediaRecorderStatus: status,
    isRecording,
    previewStream,
    startMeeting,
    endMeeting,
    audioBlob,
    transcription,
    minutes,
    loading,
    isTranscribing,
    isGeneratingMinutes,
    error,
    meetings,
    currentMeeting,
    saveAudioBlob,
    transcribeMeetingAudio,
    generateAndSaveMeeting,
    loadUserMeetings,
    loadMeeting,
    removeMeeting,
  };

  return (
    <MeetingContext.Provider value={value}>{children}</MeetingContext.Provider>
  );
}

export const MeetingProvider = MeetingProviderComponent;
export default MeetingContext;
