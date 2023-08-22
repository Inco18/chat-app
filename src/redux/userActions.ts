import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  User,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  deleteUser,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { auth, db, storage } from "../services/firebase";
import {
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { IFormInput } from "../components/form/SignUpForm";
import { initialState, userStateType } from "./userSlice";
import { signInForm } from "../components/form/SignInForm";
import { loadUserFromDb, reauthenticate } from "../services/auth";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

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

export const changeEmail = createAsyncThunk(
  "user/changeEmail",
  async (data: { password: string; newEmail: string }) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Could not get user");
    await reauthenticate(data.password);
    await updateEmail(user, data.newEmail);
    return data.newEmail;
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (data: { oldPassword: string; newPassword: string }) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Could not get user");
    await reauthenticate(data.oldPassword);
    await updatePassword(user, data.newPassword);
  }
);

export const changeAllowText = createAsyncThunk(
  "user/changeAllowText",
  async (allowText: boolean) => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Could not get user's id");
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, { allowText: allowText });
    return { allowText };
  }
);

export const deleteAccount = createAsyncThunk(
  "user/deleteAccount",
  async (password: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Could not get user");
    await reauthenticate(password);
    await deleteDoc(doc(db, "users", user.uid));
    await deleteUser(user);
  }
);

export const uploadProfileImg = createAsyncThunk(
  "user/uploadProfileImg",
  async (blob: Blob) => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Could not get user's id");
    const storageRef = ref(storage, `avatars/${uid}`);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    await updateDoc(doc(db, "users", uid), {
      avatarUrl: url,
    });
    return url;
  }
);

export const deleteProfileImg = createAsyncThunk(
  "user/deleteProfileImg",
  async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Could not get user's id");
    const storageRef = ref(storage, `avatars/${uid}`);
    await deleteObject(storageRef);
    await updateDoc(doc(db, "users", uid), {
      avatarUrl: null,
    });
  }
);

export function clearUser(state: userStateType) {
  return { ...initialState, status: "idle" };
}
