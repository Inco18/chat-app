import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { IFormInput } from "../components/form/SignUpForm";
import { initialState, userStateType } from "./userSlice";

export const signUp = createAsyncThunk(
  "user/signUp",
  async (userData: IFormInput) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    const user = userCredential.user;
    const birthDate = new Date();
    birthDate.setFullYear(userData.year);
    birthDate.setMonth(userData.month - 1);
    birthDate.setDate(userData.day);
    await setDoc(doc(db, "users", user.uid), {
      firstName: userData.firstName,
      lastName: userData.lastName,
      sex: userData.sex,
      userChats: [],
      notifications: [],
      birthDate: Timestamp.fromDate(birthDate),
      avatarUrl: null,
    });
    return {
      firstName: userData.firstName,
      lastName: userData.lastName,
      sex: userData.sex,
      birthDate: birthDate.toDateString(),
    };
  }
);

export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (userId: string) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        firstName: data.firstName,
        lastName: data.lastName,
        sex: data.sex,
        avatarUrl: data.avatarUrl,
        notifications: data.notifications,
        birthDate: new Date(data.birthDate.seconds * 1000).toDateString(),
      };
    } else {
      throw new Error("User informations not found");
    }
  }
);

export function clearUser(state: userStateType) {
  return { ...initialState, status: "idle" };
}
