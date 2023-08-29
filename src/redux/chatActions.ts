import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  limit,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../services/firebase";
import { userStateType } from "./userSlice";
import { chatStateType } from "./chatSlice";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { loadChatUsers } from "../services/firestore";

export const createChat = createAsyncThunk<
  any,
  any,
  { state: { user: userStateType; chat: chatStateType } }
>("chat/createChat", async (userData: any, thunkApi) => {
  console.log(userData);
  const currentUser = thunkApi.getState().user;
  const dbObject = {
    archived: false,
    blocked: [],
    chatImgUrl: "",
    favourite: [],
    lastMsg: {},
    settings: { nicknames: {}, themeColor: "#5852d6" },
    title: "",
    trash: [],
    users: [auth.currentUser?.uid, userData.id],
  };
  const docRef = await addDoc(collection(db, "chats"), dbObject);
  await setDoc(doc(db, "messages", docRef.id), {});
  await addDoc(collection(db, "messages", docRef.id, "messages"), {
    type: "initial",
    value: "",
    sentAt: Timestamp.fromDate(new Date()),
    sentBy: "",
  });

  return {
    ...dbObject,
    messages: [],
    id: docRef.id,
    users: [
      {
        uid: auth.currentUser?.uid,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        sex: currentUser.sex,
        avatarUrl: currentUser.avatarUrl,
      },
      {
        uid: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        sex: userData.sex,
        avatarUrl: userData.avatarUrl,
      },
    ],
  };
});

export const createGroupChat = createAsyncThunk<
  any,
  any,
  { state: { user: userStateType; chat: chatStateType } }
>("chat/createGroupChat", async (chatData: any, thunkApi) => {
  const currentUser = thunkApi.getState().user;
  console.log(chatData);
  const dbObject = {
    archived: false,
    blocked: [],
    chatImgUrl: "",
    favourite: [],
    lastMsg: {},
    settings: { nicknames: {}, themeColor: "#5852d6" },
    title: chatData.title,
    trash: [],
    users: [
      auth.currentUser?.uid,
      ...chatData.users.map((user: any) => {
        return user.id;
      }),
    ],
  };
  const newChatRef = doc(collection(db, "chats"));
  if (chatData.imgBlob) {
    const storageRef = ref(storage, `chatImgs/${newChatRef.id}`);
    await uploadBytes(storageRef, chatData.imgBlob);
    const url = await getDownloadURL(storageRef);
    dbObject.chatImgUrl = url;
  }
  console.log(dbObject);
  await setDoc(newChatRef, dbObject);
  await setDoc(doc(db, "messages", newChatRef.id), {});
  await addDoc(collection(db, "messages", newChatRef.id, "messages"), {
    type: "initial",
    value: "",
    sentAt: Timestamp.fromDate(new Date()),
    sentBy: "",
  });

  return {
    ...dbObject,
    messages: [],
    id: newChatRef.id,
    users: [
      {
        uid: auth.currentUser?.uid,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        sex: currentUser.sex,
        avatarUrl: currentUser.avatarUrl,
      },
      ...chatData.users.map((user: any) => {
        return {
          uid: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          sex: user.sex,
          avatarUrl: user.avatarUrl,
        };
      }),
    ],
  };
});

export const openChatWithClick = createAsyncThunk<
  any,
  any,
  { state: { user: userStateType; chat: chatStateType } }
>("chat/openChatWithClick", async (chatData: any, thunkApi) => {
  const currentUser = thunkApi.getState().user;
  const newUsers = await loadChatUsers(chatData, currentUser);
  return { ...chatData, users: newUsers };
});

export const openChatWithId = createAsyncThunk<
  any,
  any,
  { state: { user: userStateType; chat: chatStateType } }
>("chat/openChatWithId", async (chatId: string, thunkApi) => {
  const currentUser = thunkApi.getState().user;
  const chatSnapshot = await getDoc(doc(db, "chats", chatId));
  if (chatSnapshot.exists()) {
    const chatData = chatSnapshot.data();
    const newUsers = await loadChatUsers(chatData, currentUser);
    return { ...chatData, users: newUsers, id: chatId };
  } else {
    throw new Error("This chat doesn't exist");
  }
});
