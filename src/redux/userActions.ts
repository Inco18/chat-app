import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  User,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import { Timestamp, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { IFormInput } from "../components/form/SignUpForm";
import { initialState, userStateType } from "./userSlice";
import { signInForm } from "../components/form/SignInForm";
import { loadUserFromDb } from "../services/auth";

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
      allowText: true,
    });
    return {
      firstName: userData.firstName,
      lastName: userData.lastName,
      sex: userData.sex,
      birthDate: birthDate.toDateString(),
      email: user.email ? user.email : "",
    };
  }
);

export const signIn = createAsyncThunk(
  "user/signIn",
  async (userData: signInForm) => {
    await setPersistence(
      auth,
      userData.rememberMe ? browserLocalPersistence : browserSessionPersistence
    );
    const userCredential = await signInWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    const user = userCredential.user;
    const userFromDb = await loadUserFromDb(user.uid);
    return {
      ...userFromDb,
      email: user.email ? user.email : "",
    };
  }
);

export const logout = createAsyncThunk("user/logout", async () => {
  await signOut(auth);
});

export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (user: User) => {
    const userFromDb = await loadUserFromDb(user.uid);
    return {
      ...userFromDb,
      email: user.email ? user.email : "",
    };
  }
);

export const changeFirstName = createAsyncThunk(
  "user/changeFirstName",
  async (firstName: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Could not get user's id");
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, { firstName: firstName });
    return { firstName };
  }
);

export const changeLastName = createAsyncThunk(
  "user/changeLastName",
  async (lastName: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Could not get user's id");
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, { lastName: lastName });
    return { lastName };
  }
);

export const changeAllowText = createAsyncThunk(
  "/user/changeAllowText",
  async (allowText: boolean) => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Could not get user's id");
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, { allowText: allowText });
    return { allowText };
  }
);

export function clearUser(state: userStateType) {
  return { ...initialState, status: "idle" };
}
