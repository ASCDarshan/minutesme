import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactMediaRecorder } from 'react-media-recorder'; // Import the hook
import {
  collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from './AuthContext';
import { transcribeAudio, generateMinutes } from '../services/openai';

// Create the meeting context
const MeetingContext = createContext();

// Create a hook to use the meeting context
export const useMeeting = () => {
  return useContext(MeetingContext);
};

// Meeting provider component
function MeetingProviderComponent({ children }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  // Removed local isRecording state
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState(''); // To store transcription text
  const [minutes, setMinutes] = useState(null); // Stores the parsed minutes object
  const [loading, setLoading] = useState(false); // General loading for processing/fetching
  const [isTranscribing, setIsTranscribing] = useState(false); // Specific loading state
  const [isGeneratingMinutes, setIsGeneratingMinutes] = useState(false); // Specific loading state
  const [error, setError] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [currentMeeting, setCurrentMeeting] = useState(null);

  // --- Integrate react-media-recorder ---
  const {
    status, // 'idle', 'recording', 'stopped', 'acquiring_media', 'error'
    startRecording: startMediaRecorder,
    stopRecording: stopMediaRecorder,
    mediaBlobUrl,
    previewStream,
    clearBlobUrl
  } = useReactMediaRecorder({
    audio: true,
    video: false,
    onStop: (blobUrl, blob) => {
      // ADDED LOG
      console.log("CONTEXT/onStop: react-media-recorder onStop triggered.");
      saveAudioBlob(blob);
    },
    onStart: () => {
      // ADDED LOG
      console.log("CONTEXT/onStart: react-media-recorder onStart triggered.");
      setError(null); // Clear errors on successful start
    },
    onError: (err) => {
        console.error("CONTEXT/onError: react-media-recorder Error:", err);
        setError(`Recording Error: ${err.message || err.name}. Please ensure microphone access is granted.`);
    }
  });
  // ---------------------------------------

  // Derived state: isRecording
  const isRecording = status === 'recording';

  // Save audio blob
  const saveAudioBlob = (blob) => {
    // ADDED LOG
    console.log("CONTEXT/saveAudioBlob: Saving audio blob", blob);
    setAudioBlob(blob);
  };

  // Start recording a meeting
  const startMeeting = () => {
    // ADDED LOG
    console.log("CONTEXT/startMeeting: Attempting to start recording.");
    if (isRecording) {
      console.warn("CONTEXT/startMeeting: Already recording.");
      return;
    }
    // Reset state for new meeting
    setError(null);
    setAudioBlob(null);
    setTranscription(''); // Clear previous transcription
    setMinutes(null);   // Clear previous minutes
    setIsTranscribing(false);
    setIsGeneratingMinutes(false);
    clearBlobUrl();

    console.log("CONTEXT/startMeeting: Calling startMediaRecorder...");
    startMediaRecorder();
  };

  // End recording a meeting
  const endMeeting = () => {
    // ADDED LOG
    console.log("CONTEXT/endMeeting: Attempting to stop recording.");
     if (!isRecording) {
      console.warn("CONTEXT/endMeeting: Not recording, cannot stop.");
      return;
    }
    console.log("CONTEXT/endMeeting: Calling stopMediaRecorder...");
    stopMediaRecorder();
    // ADDED LOG
    console.log("CONTEXT/endMeeting: stopMediaRecorder() called.");
    // onStop callback will handle saveAudioBlob
  };

  // Process a meeting: Transcribe Only (for displaying text first)
  const transcribeMeetingAudio = async () => {
      // ADDED LOG
      console.log("CONTEXT/transcribeMeetingAudio: Function called.");
      if (!audioBlob) {
          console.error("CONTEXT/transcribeMeetingAudio: No audioBlob found.");
          setError("No recording available to transcribe.");
          return false;
      }
      if (transcription) {
          console.log("CONTEXT/transcribeMeetingAudio: Transcription already exists.");
          return true; // Already done
      }

      console.log("CONTEXT/transcribeMeetingAudio: Starting transcription process...");
      setLoading(true); // Use general loading or specific one
      setIsTranscribing(true);
      setError(null);

      try {
          // ADDED LOG
          console.log("CONTEXT/transcribeMeetingAudio: Calling transcribeAudio service...");
          const transcript = await transcribeAudio(audioBlob);
          if (!transcript && transcript !== "") { // Allow empty string result
              throw new Error("Transcription result was empty or invalid.");
          }
          // ADDED LOG
          console.log("CONTEXT/transcribeMeetingAudio: Transcription successful, received text length:", transcript?.length);
          setTranscription(transcript); // Update state
          setIsTranscribing(false);
          setLoading(false);
          return true;
      } catch (err) {
          console.error("CONTEXT/transcribeMeetingAudio: Failed to transcribe audio:", err);
          setError(`Transcription failed: ${err.message}`);
          setIsTranscribing(false);
          setLoading(false);
          return false;
      }
  };


  // Process a meeting: Generate Minutes and Save All
  const generateAndSaveMeeting = async (title = "Untitled Meeting") => {
    // ADDED LOG
    console.log("CONTEXT/generateAndSaveMeeting: Function called.");
    if (!audioBlob || !currentUser) {
      console.error("CONTEXT/generateAndSaveMeeting: Missing audioBlob or currentUser.");
      setError("No recording available or user not logged in");
      return null;
    }
    if (!transcription) {
      console.error("CONTEXT/generateAndSaveMeeting: Missing transcription.");
      setError("Transcription must be completed before generating minutes.");
      return null;
    }

    console.log(`CONTEXT/generateAndSaveMeeting: Starting process for title: "${title}"`);
    setLoading(true);
    setIsGeneratingMinutes(true);
    setError(null);

    const processingTimeout = setTimeout(() => {
      if (isGeneratingMinutes || loading) {
        console.warn("CONTEXT/generateAndSaveMeeting: Processing timed out after 3 minutes.");
        setLoading(false);
        setIsGeneratingMinutes(false);
        setError("Processing took too long and timed out. Please try again.");
      }
    }, 180000);

    let audioUrl = null;
    let generatedMinutesData = minutes;
    let meetingId = null;

    try {
      // Step 1: Generate minutes
      if (!generatedMinutesData || (generatedMinutesData && generatedMinutesData.error)) {
         console.log("CONTEXT/generateAndSaveMeeting: Step 1 - Generating minutes...");
          try {
            // ADDED LOG
            console.log("CONTEXT/generateAndSaveMeeting: Calling generateMinutes service...");
            generatedMinutesData = await generateMinutes(transcription, title);
            // ADDED LOG
            console.log("CONTEXT/generateAndSaveMeeting: generateMinutes service returned:", generatedMinutesData);

            if (generatedMinutesData && generatedMinutesData.error) {
              console.error("CONTEXT/generateAndSaveMeeting: Minutes generation resulted in an error state:", generatedMinutesData.error);
              setError(`Minutes Generation Failed: ${generatedMinutesData.error}`);
            } else if (!generatedMinutesData) {
                throw new Error("Minutes generation result was empty or undefined.");
            }
            setMinutes(generatedMinutesData); // Update state regardless of error for potential partial display
            console.log("CONTEXT/generateAndSaveMeeting: Minutes generation processing finished.");
          } catch (minutesError) {
            console.error("CONTEXT/generateAndSaveMeeting: Failed during minutes generation call:", minutesError);
            setError(`Minutes generation failed: ${minutesError.message}`);
            setIsGeneratingMinutes(false); setLoading(false); clearTimeout(processingTimeout); return null;
          }
      } else {
          console.log("CONTEXT/generateAndSaveMeeting: Step 1 - Skipping minutes generation (already have valid data).");
      }
       setIsGeneratingMinutes(false); // Minutes generation part is done

      // Step 2: Store results in Firebase
      console.log("CONTEXT/generateAndSaveMeeting: Step 2 - Storing results in Firebase...");
      const meetingStatus = (generatedMinutesData && !generatedMinutesData.error) ? 'completed' : 'completed_partial';
      const hasValidMinutes = (generatedMinutesData && !generatedMinutesData.error);
      console.log(`CONTEXT/generateAndSaveMeeting: Determined meetingStatus='${meetingStatus}', hasValidMinutes=${hasValidMinutes}`);

      console.log("CONTEXT/generateAndSaveMeeting: Creating Firestore document...");
      const meetingData = { /* ... data ... */ title, status: meetingStatus, creatorName: currentUser.displayName || 'Unknown User', creatorEmail: currentUser.email, userId: currentUser.uid, hasTranscription: true, hasMinutes: hasValidMinutes, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
      const meetingsRef = collection(db, "meetings");
      const docRef = await addDoc(meetingsRef, meetingData);
      meetingId = docRef.id;
      console.log(`CONTEXT/generateAndSaveMeeting: Firestore document created: ${meetingId}`);

      // Upload audio
      console.log("CONTEXT/generateAndSaveMeeting: Uploading audio...");
      const audioPath = `recordings/${currentUser.uid}/${meetingId}/audio.webm`;
      const audioRef = ref(storage, audioPath);
      await uploadBytes(audioRef, audioBlob);
      audioUrl = await getDownloadURL(audioRef);
      console.log("CONTEXT/generateAndSaveMeeting: Audio uploaded:", audioUrl);

      // Prepare & Upload minutes JSON
      console.log("CONTEXT/generateAndSaveMeeting: Uploading minutes JSON...");
      const minutesToStore = { ...(generatedMinutesData || { error: "Minutes data unavailable." }), transcription: transcription, audioUrl: audioUrl, };
      const minutesPath = `minutes/${currentUser.uid}/${meetingId}/minutes.json`;
      const minutesRef = ref(storage, minutesPath);
      const jsonBlob = new Blob([JSON.stringify(minutesToStore, null, 2)], { type: 'application/json' });
      await uploadBytes(minutesRef, jsonBlob);
      const minutesUrl = await getDownloadURL(minutesRef);
      console.log("CONTEXT/generateAndSaveMeeting: Minutes JSON uploaded:", minutesUrl);

      // Update Firestore doc with URLs
      console.log("CONTEXT/generateAndSaveMeeting: Updating Firestore doc with URLs...");
      const meetingRef = doc(db, "meetings", meetingId);
      await updateDoc(meetingRef, { audioUrl, minutesUrl, updatedAt: serverTimestamp() });

      console.log("CONTEXT/generateAndSaveMeeting: Save complete! Navigating...");
      clearTimeout(processingTimeout); setLoading(false); navigate(`/meeting/${meetingId}`); return meetingId;
    } catch (err) {
      console.error("CONTEXT/generateAndSaveMeeting: Error during Firebase storage/update:", err);
      setError(`Error saving results: ${err.message}`);
      if (meetingId) { try { const meetingRef = doc(db, "meetings", meetingId); await updateDoc(meetingRef, { status: 'failed', error: `Save failed: ${err.message}`, updatedAt: serverTimestamp() }); } catch (updateError) { console.error("CONTEXT: Failed to update meeting status to failed:", updateError); } }
      clearTimeout(processingTimeout); setIsGeneratingMinutes(false); setLoading(false); return null;
    }
  };

  // Load user meetings
  const loadUserMeetings = async () => {
    if (!currentUser) { setMeetings([]); return; }
    setLoading(true); setError(null);
    try {
      console.log("CONTEXT/loadUserMeetings: Loading for UID:", currentUser.uid); // LOG
      const meetingsRef = collection(db, "meetings");
      const q = query(meetingsRef, where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const userMeetings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      userMeetings.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      console.log(`CONTEXT/loadUserMeetings: Found ${userMeetings.length} meetings.`); // LOG
      setMeetings(userMeetings);
    } catch (err) { console.error("CONTEXT/loadUserMeetings: Error:", err); setError(`Error loading meetings: ${err.message}`); setMeetings([]); }
    finally { setLoading(false); }
  };

  // Load a specific meeting
  const loadMeeting = async (meetingId) => {
     if (!currentUser || !meetingId) return null;
     setLoading(true); setError(null); setCurrentMeeting(null);
     try {
       console.log(`CONTEXT/loadMeeting: Loading meeting ID: ${meetingId}`); // LOG
       const meetingRef = doc(db, "meetings", meetingId);
       const meetingSnap = await getDoc(meetingRef);
       if (!meetingSnap.exists() || meetingSnap.data().userId !== currentUser.uid) { throw new Error("Meeting not found or access denied."); }
       const meetingData = { id: meetingSnap.id, ...meetingSnap.data() };
       if (meetingData.minutesUrl) {
         try {
           console.log(`CONTEXT/loadMeeting: Fetching minutes from: ${meetingData.minutesUrl}`); // LOG
           const response = await fetch(meetingData.minutesUrl);
           if (!response.ok) throw new Error(`Failed to fetch minutes (Status: ${response.status})`);
           meetingData.minutesData = await response.json();
           console.log("CONTEXT/loadMeeting: Minutes data fetched successfully."); // LOG
         } catch (fetchError) { console.error("CONTEXT/loadMeeting: Error fetching minutes data:", fetchError); setError(`Failed to load minutes details: ${fetchError.message}`); meetingData.minutesData = { error: "Could not load minutes details." }; }
       } else { meetingData.minutesData = null; }
       setCurrentMeeting(meetingData); return meetingData;
     } catch (err) { console.error("CONTEXT/loadMeeting: Error loading meeting:", err); setError(`Error loading meeting: ${err.message}`); setCurrentMeeting(null); return null; }
     finally { setLoading(false); }
  };

  // Remove meeting
  const removeMeeting = async (meetingId) => {
      if (!currentUser || !meetingId) return false;
      setLoading(true); setError(null);
      try {
        console.log(`CONTEXT/removeMeeting: Attempting removal for ID: ${meetingId}`); // LOG
        const meetingRef = doc(db, "meetings", meetingId);
        const meetingSnap = await getDoc(meetingRef);
        if (!meetingSnap.exists() || meetingSnap.data().userId !== currentUser.uid) { throw new Error("Meeting not found or permission denied."); }
        const audioPath = `recordings/${currentUser.uid}/${meetingId}/audio.webm`;
        const minutesPath = `minutes/${currentUser.uid}/${meetingId}/minutes.json`;
        try { await deleteObject(ref(storage, audioPath)); console.log("CONTEXT/removeMeeting: Deleted audio.");} catch (e) { if(e.code !== 'storage/object-not-found') console.warn("Audio delete failed:", e.message); }
        try { await deleteObject(ref(storage, minutesPath)); console.log("CONTEXT/removeMeeting: Deleted minutes."); } catch (e) { if(e.code !== 'storage/object-not-found') console.warn("Minutes delete failed:", e.message); }
        await deleteDoc(meetingRef); console.log("CONTEXT/removeMeeting: Deleted Firestore doc."); // LOG
        setMeetings(prev => prev.filter(m => m.id !== meetingId));
        if (currentMeeting?.id === meetingId) setCurrentMeeting(null);
        return true;
      } catch (err) { console.error("CONTEXT/removeMeeting: Error deleting meeting:", err); setError(`Error deleting meeting: ${err.message}`); return false; }
      finally { setLoading(false); }
  };


  // Values to provide in the context
  const value = {
    mediaRecorderStatus: status, isRecording, previewStream,
    startMeeting, endMeeting,
    audioBlob, transcription, minutes, loading, isTranscribing, isGeneratingMinutes, error, meetings, currentMeeting,
    saveAudioBlob, transcribeMeetingAudio, generateAndSaveMeeting, loadUserMeetings, loadMeeting, removeMeeting
  };

  return (
    <MeetingContext.Provider value={value}>
      {children}
    </MeetingContext.Provider>
  );
}

// Export named components and context
export const MeetingProvider = MeetingProviderComponent;
export default MeetingContext;