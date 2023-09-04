import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../services/firebase";
import { userStateType } from "./userSlice";
import { chatStateType } from "./chatSlice";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { handleOtherAction, loadChatUsers } from "../services/firestore";

export const createChat = createAsyncThunk<
  any,
  any,
  { state: { user: userStateType; chat: chatStateType } }
>("chat/createChat", async (userData: any, thunkApi) => {
  console.log(userData);
  const currentUser = thunkApi.getState().user;
  const dbObject = {
    events: [],
    archived: false,
    blocked: [],
    muted: [],
    chatImgUrl: "",
    favourite: [],
    lastMsg: {},
    settings: {
      nicknames: {},
      themeColor: "#5852d6",
      themeColorLight: "#6963db",
      themeColorLightHover: "#837ee4",
    },
    title: "",
    trash: [],
    users: [auth.currentUser?.uid, userData.id],
  };
  const docRef = await addDoc(collection(db, "chats"), dbObject);
  await setDoc(doc(db, "messages", docRef.id), {});
  // await addDoc(collection(db, "messages", docRef.id, "messages"), {
  //   type: "initial",
  //   value: "",
  //   sentAt: Timestamp.fromDate(new Date()),
  //   sentBy: "",
  // });

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
    events: [],
    archived: false,
    blocked: [],
    muted: [],
    chatImgUrl: "",
    favourite: [],
    lastMsg: {},
    settings: {
      nicknames: {},
      themeColor: "#5852d6",
      themeColorLight: "#6963db",
      themeColorLightHover: "#837ee4",
    },
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
  // await addDoc(collection(db, "messages", newChatRef.id, "messages"), {
  //   type: "initial",
  //   value: "",
  //   sentAt: Timestamp.fromDate(new Date()),
  //   sentBy: "",
  // });

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
  return {
    ...chatData,
    users: newUsers,
    lastMsg: {
      ...chatData.lastMsg,
      timestamp: chatData.lastMsg.timestamp ? chatData.lastMsg.timestamp : "",
    },
  };
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
    return {
      ...chatData,
      users: newUsers,
      id: chatId,
      lastMsg: {
        ...chatData.lastMsg,
        timestamp: chatData.lastMsg.timestamp
          ? chatData.lastMsg.timestamp.toDate().toString()
          : "",
      },
    };
  } else {
    throw new Error("This chat doesn't exist");
  }
});

export const handleFavourite = createAsyncThunk<
  any,
  any,
  { state: { user: userStateType; chat: chatStateType } }
>("chat/handleFavourite", async (_, { getState }) => {
  const favouritesArray = [...getState().chat.favourite];
  const resultArray = handleOtherAction(favouritesArray);
  await updateDoc(doc(db, "chats", getState().chat.id), {
    favourite: resultArray,
  });
  return resultArray;
});

export const editNickname = createAsyncThunk<
  { newNickname: string; uid: string },
  { newNickname: string; uid: string },
  { state: { user: userStateType; chat: chatStateType } }
>(
  "chat/editNickname",
  async (data: { newNickname: string; uid: string }, { getState }) => {
    console.log(data);
    await updateDoc(doc(db, "chats", getState().chat.id), {
      [`settings.nicknames.${data.uid}`]: data.newNickname,
    });
    return data;
  }
);

export const changeChatTheme = createAsyncThunk<
  string[],
  string[],
  { state: { user: userStateType; chat: chatStateType } }
>("chat/changeChatTheme", async (themeColors: string[], { getState }) => {
  const chatId = getState().chat.id;
  await updateDoc(doc(db, "chats", chatId), {
    "settings.themeColor": themeColors[0],
    "settings.themeColorLight": themeColors[1],
    "settings.themeColorLightHover": themeColors[2],
  });

  return themeColors;
});

export const handleMute = createAsyncThunk<
  any,
  any,
  { state: { user: userStateType; chat: chatStateType } }
>("chat/handleMute", async (_, { getState }) => {
  const mutedArray = [...getState().chat.muted];
  const resultArray = handleOtherAction(mutedArray);
  await updateDoc(doc(db, "chats", getState().chat.id), {
    muted: resultArray,
  });
  return resultArray;
});

export const handleBlock = createAsyncThunk<
  any,
  any,
  { state: { user: userStateType; chat: chatStateType } }
>("chat/handleBlock", async (_, { getState }) => {
  const blockedArray = [...getState().chat.blocked];
  const resultArray = handleOtherAction(blockedArray);
  await updateDoc(doc(db, "chats", getState().chat.id), {
    blocked: resultArray,
    favourite: [],
  });
  return resultArray;
});

export const handleDelete = createAsyncThunk<
  any,
  any,
  { state: { user: userStateType; chat: chatStateType } }
>("chat/handleDelete", async (_, { getState }) => {
  const trashArray = [...getState().chat.trash];
  const resultArray = handleOtherAction(trashArray);
  const filteredFavourite = getState().chat.favourite.filter(
    (userId) => userId !== auth.currentUser?.uid
  );
  await updateDoc(doc(db, "chats", getState().chat.id), {
    trash: resultArray,
    favourite: filteredFavourite,
  });
  return { resultArray, filteredFavourite };
});

export const handlePermDelete = createAsyncThunk<
  any,
  any,
  { state: { user: userStateType; chat: chatStateType } }
>("chat/handlePermDelete", async (_, { getState }) => {
  const userId = auth.currentUser?.uid;
  const usersArray = getState().chat.users;
  const newUsersArray = usersArray.filter((user) => user.uid !== userId);
  if (!getState().chat.archived) {
    const willBeArchived = getState().chat.title === "" ? true : false;
    const newDbUsers = newUsersArray.map((user) => user.uid);
    const newTrash = getState().chat.trash.filter((uid) => uid !== userId);
    await updateDoc(doc(db, "chats", getState().chat.id), {
      archived: willBeArchived,
      users: newDbUsers,
      trash: newTrash,
    });
  } else {
    await deleteDoc(doc(db, "chats", getState().chat.id));
  }
});

export const sendMessage = createAsyncThunk<
  any,
  any,
  { state: { user: userStateType; chat: chatStateType } }
>(
  "chat/sendMessage",
  async (
    message: { text: string; files: File[]; gifUrl: string },
    { getState }
  ) => {
    console.log(message);
    const dbMessage = {
      filesUrls: <string[]>[],
      sentBy: auth.currentUser?.uid,
      text: message.text,
      timestamp: serverTimestamp(),
      gifUrl: message.gifUrl,
    };

    if (message.files.length > 0) {
      const urlArr: string[] = await Promise.all(
        message.files.map(async (file) => {
          const storageRef = ref(
            storage,
            `chats/${getState().chat.id}/${file.name}`
          );
          const res = await uploadBytes(storageRef, file);
          const url = await getDownloadURL(res.ref);
          return url;
        })
      );
      dbMessage.filesUrls = urlArr;
    }

    await addDoc(
      collection(db, "messages", getState().chat.id, "messages"),
      dbMessage
    );

    return { ...dbMessage, timestamp: new Date().toString() };
  }
);
