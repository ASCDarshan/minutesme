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
      console.log("CONTEXT/onStop: react-media-recorder onStop triggered.");
      saveAudioBlob(blob);
    },
    onStart: () => {
      console.log("CONTEXT/onStart: react-media-recorder onStart triggered.");
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
    console.log("CONTEXT/saveAudioBlob: Saving audio blob", blob);
    setAudioBlob(blob);
  };

  const startMeeting = () => {
    console.log("CONTEXT/startMeeting: Attempting to start recording.");
    if (isRecording) {
      console.warn("CONTEXT/startMeeting: Already recording.");
      return;
    }
    setError(null);
    setAudioBlob(null);
    setTranscription("");
    setMinutes(null);
    setIsTranscribing(false);
    setIsGeneratingMinutes(false);
    clearBlobUrl();

    console.log("CONTEXT/startMeeting: Calling startMediaRecorder...");
    startMediaRecorder();
  };

  const endMeeting = () => {
    console.log("CONTEXT/endMeeting: Attempting to stop recording.");
    if (!isRecording) {
      console.warn("CONTEXT/endMeeting: Not recording, cannot stop.");
      return;
    }
    console.log("CONTEXT/endMeeting: Calling stopMediaRecorder...");
    stopMediaRecorder();
    console.log("CONTEXT/endMeeting: stopMediaRecorder() called.");
  };

  const transcribeMeetingAudio = async () => {
    console.log("CONTEXT/transcribeMeetingAudio: Function called.");
    if (!audioBlob) {
      console.error("CONTEXT/transcribeMeetingAudio: No audioBlob found.");
      setError("No recording available to transcribe.");
      return false;
    }
    if (transcription) {
      console.log(
        "CONTEXT/transcribeMeetingAudio: Transcription already exists."
      );
      return true;
    }

    console.log(
      "CONTEXT/transcribeMeetingAudio: Starting transcription process..."
    );
    setLoading(true);
    setIsTranscribing(true);
    setError(null);

    try {
      console.log(
        "CONTEXT/transcribeMeetingAudio: Calling transcribeAudio service..."
      );
      const transcript = await transcribeAudio(audioBlob);
      if (!transcript && transcript !== "") {
        throw new Error("Transcription result was empty or invalid.");
      }
      console.log(
        "CONTEXT/transcribeMeetingAudio: Transcription successful, received text length:",
        transcript?.length
      );
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
    console.log("CONTEXT/generateAndSaveMeeting: Function called.");
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

    console.log(
      `CONTEXT/generateAndSaveMeeting: Starting process for title: "${title}"`
    );
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
        console.log(
          "CONTEXT/generateAndSaveMeeting: Step 1 - Generating minutes..."
        );
        try {
          console.log(
            "CONTEXT/generateAndSaveMeeting: Calling generateMinutes service..."
          );
          generatedMinutesData = await generateMinutes(transcription, title);
          console.log(
            "CONTEXT/generateAndSaveMeeting: generateMinutes service returned:",
            generatedMinutesData
          );

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
          console.log(
            "CONTEXT/generateAndSaveMeeting: Minutes generation processing finished."
          );
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

      console.log(
        "CONTEXT/generateAndSaveMeeting: Step 2 - Storing results in Firebase..."
      );
      const meetingStatus =
        generatedMinutesData && !generatedMinutesData.error
          ? "completed"
          : "completed_partial";
      const hasValidMinutes =
        generatedMinutesData && !generatedMinutesData.error;
      console.log(
        `CONTEXT/generateAndSaveMeeting: Determined meetingStatus='${meetingStatus}', hasValidMinutes=${hasValidMinutes}`
      );

      console.log(
        "CONTEXT/generateAndSaveMeeting: Creating Firestore document..."
      );
      const meetingData = {
        /* ... data ... */ title,
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
      console.log(
        `CONTEXT/generateAndSaveMeeting: Firestore document created: ${meetingId}`
      );

      console.log("CONTEXT/generateAndSaveMeeting: Uploading audio...");
      const audioPath = `recordings/${currentUser.uid}/${meetingId}/audio.webm`;
      const audioRef = ref(storage, audioPath);
      await uploadBytes(audioRef, audioBlob);
      audioUrl = await getDownloadURL(audioRef);
      console.log("CONTEXT/generateAndSaveMeeting: Audio uploaded:", audioUrl);

      console.log("CONTEXT/generateAndSaveMeeting: Uploading minutes JSON...");
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
      console.log(
        "CONTEXT/generateAndSaveMeeting: Minutes JSON uploaded:",
        minutesUrl
      );

      console.log(
        "CONTEXT/generateAndSaveMeeting: Updating Firestore doc with URLs..."
      );
      const meetingRef = doc(db, "meetings", meetingId);
      await updateDoc(meetingRef, {
        audioUrl,
        minutesUrl,
        updatedAt: serverTimestamp(),
      });

      console.log(
        "CONTEXT/generateAndSaveMeeting: Save complete! Navigating..."
      );
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
      console.log(
        "CONTEXT/loadUserMeetings: Loading for UID:",
        currentUser.uid
      );
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
      console.log(
        `CONTEXT/loadUserMeetings: Found ${userMeetings.length} meetings.`
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
      console.log(`CONTEXT/loadMeeting: Loading meeting ID: ${meetingId}`);
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
          console.log(
            `CONTEXT/loadMeeting: Fetching minutes from: ${meetingData.minutesUrl}`
          );
          const response = await fetch(meetingData.minutesUrl);
          if (!response.ok)
            throw new Error(
              `Failed to fetch minutes (Status: ${response.status})`
            );
          meetingData.minutesData = await response.json();
          console.log(
            "CONTEXT/loadMeeting: Minutes data fetched successfully."
          );
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
      console.log(
        `CONTEXT/removeMeeting: Attempting removal for ID: ${meetingId}`
      );
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
        console.log("CONTEXT/removeMeeting: Deleted audio.");
      } catch (e) {
        if (e.code !== "storage/object-not-found")
          console.warn("Audio delete failed:", e.message);
      }
      try {
        await deleteObject(ref(storage, minutesPath));
        console.log("CONTEXT/removeMeeting: Deleted minutes.");
      } catch (e) {
        if (e.code !== "storage/object-not-found")
          console.warn("Minutes delete failed:", e.message);
      }
      await deleteDoc(meetingRef);
      console.log("CONTEXT/removeMeeting: Deleted Firestore doc.");
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
