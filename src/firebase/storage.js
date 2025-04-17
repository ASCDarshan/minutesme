import { 
    ref, 
    uploadBytes, 
    getDownloadURL, 
    listAll, 
    deleteObject 
  } from "firebase/storage";
  import { storage } from "./config";
  
  // Upload audio file to Firebase Storage
  export const uploadAudio = async (userId, meetingId, audioBlob) => {
    try {
      const audioRef = ref(storage, `recordings/${userId}/${meetingId}/audio.webm`);
      const result = await uploadBytes(audioRef, audioBlob);
      const downloadURL = await getDownloadURL(result.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading audio:", error);
      throw error;
    }
  };
  
  // Upload meeting minutes to Firebase Storage
  export const uploadMinutes = async (userId, meetingId, minutesData) => {
    try {
      const minutesRef = ref(storage, `minutes/${userId}/${meetingId}/minutes.json`);
      const jsonBlob = new Blob([JSON.stringify(minutesData)], { type: 'application/json' });
      const result = await uploadBytes(minutesRef, jsonBlob);
      const downloadURL = await getDownloadURL(result.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading minutes:", error);
      throw error;
    }
  };
  
  // Get meeting recording by ID
  export const getMeetingRecording = async (userId, meetingId) => {
    try {
      const audioRef = ref(storage, `recordings/${userId}/${meetingId}/audio.webm`);
      return await getDownloadURL(audioRef);
    } catch (error) {
      console.error("Error getting meeting recording:", error);
      throw error;
    }
  };
  
  // Get meeting minutes by ID
  export const getMeetingMinutes = async (userId, meetingId) => {
    try {
      const minutesRef = ref(storage, `minutes/${userId}/${meetingId}/minutes.json`);
      const url = await getDownloadURL(minutesRef);
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error("Error getting meeting minutes:", error);
      throw error;
    }
  };
  
  // Delete meeting data (both audio and minutes)
  export const deleteMeetingData = async (userId, meetingId) => {
    try {
      const audioRef = ref(storage, `recordings/${userId}/${meetingId}/audio.webm`);
      const minutesRef = ref(storage, `minutes/${userId}/${meetingId}/minutes.json`);
      
      await deleteObject(audioRef);
      await deleteObject(minutesRef);
      
      return true;
    } catch (error) {
      console.error("Error deleting meeting data:", error);
      throw error;
    }
  };