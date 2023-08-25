import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { userStateType } from "./userSlice";
import { chatStateType } from "./chatSlice";

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
