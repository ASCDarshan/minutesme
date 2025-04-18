import {
  collection,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

export const addMeeting = async (userId, meetingData) => {
  try {
    const meetingsRef = collection(db, "meetings");
    const newMeeting = {
      ...meetingData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(meetingsRef, newMeeting);
    return docRef.id;
  } catch (error) {
    console.error("Error adding meeting:", error);
    throw error;
  }
};

export const updateMeeting = async (meetingId, updateData) => {
  try {
    const meetingRef = doc(db, "meetings", meetingId);
    await updateDoc(meetingRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating meeting:", error);
    throw error;
  }
};

export const getMeeting = async (meetingId) => {
  try {
    const meetingRef = doc(db, "meetings", meetingId);
    const meetingSnap = await getDoc(meetingRef);

    if (meetingSnap.exists()) {
      return { id: meetingSnap.id, ...meetingSnap.data() };
    } else {
      throw new Error("Meeting not found");
    }
  } catch (error) {
    console.error("Error getting meeting:", error);
    throw error;
  }
};

export const getUserMeetings = async (userId) => {
  try {
    const meetingsRef = collection(db, "meetings");
    const q = query(
      meetingsRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting user meetings:", error);
    throw error;
  }
};

export const deleteMeeting = async (meetingId) => {
  try {
    const meetingRef = doc(db, "meetings", meetingId);
    await deleteDoc(meetingRef);
    return true;
  } catch (error) {
    console.error("Error deleting meeting:", error);
    throw error;
  }
};
