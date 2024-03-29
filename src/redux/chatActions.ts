import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Timestamp,
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../services/firebase";
import { userStateType } from "./userSlice";
import { chatStateType } from "./chatSlice";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";
import { handleOtherAction, loadChatUsers } from "../services/firestore";

export const createChat = createAsyncThunk<
  any,
  any,
  { state: { user: userStateType; chat: chatStateType } }
>("chat/createChat", async (userData: any, { getState }) => {
  const currentUser = getState().user;
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
  await updateDoc(doc(db, "users", userData.id), {
    notifications: arrayUnion({
      timestamp: Timestamp.fromDate(new Date()),
      text: `${getState().user.firstName} ${
        getState().user.lastName
      } has created a new chat with you`,
      imgUrl: getState().user.avatarUrl
        ? getState().user.avatarUrl
        : getState().user.sex === "female"
        ? "/defaultFemale.webp"
        : "/defaultMale.webp",
    }),
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
>("chat/createGroupChat", async (chatData: any, { getState }) => {
  const currentUser = getState().user;
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
  await setDoc(newChatRef, dbObject);
  await setDoc(doc(db, "messages", newChatRef.id), {});

  Promise.all(
    chatData.users.map(async (user: any) => {
      await updateDoc(doc(db, "users", user.id), {
        notifications: arrayUnion({
          timestamp: Timestamp.fromDate(new Date()),
          text: `You have been added to group: ${chatData.title} by ${
            getState().user.firstName
          } ${getState().user.lastName}`,
          imgUrl: dbObject.chatImgUrl || "/defaultGroup.webp",
        }),
      });
    })
  );

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
  const otherUserId = getState().chat.users.filter(
    (user) => user.uid !== auth.currentUser?.uid
  )[0].uid;
  if (auth.currentUser?.uid && resultArray.includes(auth.currentUser.uid)) {
    await updateDoc(doc(db, "users", otherUserId), {
      notifications: arrayUnion({
        timestamp: Timestamp.fromDate(new Date()),
        text: `You have been blocked by ${getState().user.firstName} ${
          getState().user.lastName
        }`,
        imgUrl: getState().user.avatarUrl
          ? getState().user.avatarUrl
          : getState().user.sex === "female"
          ? "/defaultFemale.webp"
          : "/defaultMale.webp",
      }),
    });
  } else {
    await updateDoc(doc(db, "users", otherUserId), {
      notifications: arrayUnion({
        timestamp: Timestamp.fromDate(new Date()),
        text: `You have been unblocked by ${getState().user.firstName} ${
          getState().user.lastName
        }`,
        imgUrl: getState().user.avatarUrl
          ? getState().user.avatarUrl
          : getState().user.sex === "female"
          ? "/defaultFemale.webp"
          : "/defaultMale.webp",
      }),
    });
  }
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
    const willBeArchived = newUsersArray.length < 2 ? true : false;
    const newDbUsers = newUsersArray.map((user) => user.uid);
    const newTrash = getState().chat.trash.filter((uid) => uid !== userId);
    await updateDoc(doc(db, "chats", getState().chat.id), {
      archived: willBeArchived,
      users: newDbUsers,
      trash: newTrash,
    });
    if (willBeArchived) {
      const otherUserId = getState().chat.users.filter(
        (user) => user.uid !== auth.currentUser?.uid
      )[0].uid;
      await updateDoc(doc(db, "users", otherUserId), {
        notifications: arrayUnion({
          timestamp: Timestamp.fromDate(new Date()),
          text: getState().chat.title
            ? `Group chat ${getState().chat.title} has been archived`
            : `Chat with ${getState().user.firstName} ${
                getState().user.lastName
              } has been archived`,
          imgUrl: getState().chat.title
            ? getState().chat.chatImgUrl
              ? getState().chat.chatImgUrl
              : "/defaultGroup.webp"
            : getState().user.avatarUrl
            ? getState().user.avatarUrl
            : getState().user.sex === "female"
            ? "/defaultFemale.webp"
            : "/defaultMale.webp",
        }),
      });
    }
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
    const uid = auth.currentUser?.uid;
    const dbMessage = {
      filesUrls: <string[]>[],
      sentBy: uid,
      text: message.text,
      timestamp: serverTimestamp(),
      gifUrl: message.gifUrl,
    };

    const dbLastMsg = {
      sentBy: uid,
      readBy: [uid],
      timestamp: serverTimestamp(),
      value: `${message.text}`,
    };

    let files: { fileUrl: String; type: string }[] = [];

    if (message.files.length > 0) {
      const urlArr: string[] = await Promise.all(
        message.files.map(async (file) => {
          const storageRef = ref(
            storage,
            `chats/${getState().chat.id}/${file.name}`
          );
          const res = await uploadBytes(storageRef, file);
          const url = await getDownloadURL(res.ref);
          files.push({ fileUrl: url, type: file.type });
          return url;
        })
      );
      dbMessage.filesUrls = urlArr;
      if (!message.text && message.files.length === 1) {
        dbLastMsg.value = "sent a file";
      } else if (!message.text && message.files.length > 1)
        dbLastMsg.value = "sent files";
    }

    if (message.gifUrl) dbLastMsg.value = "sent a gif";

    await addDoc(
      collection(db, "messages", getState().chat.id, "messages"),
      dbMessage
    );
    await updateDoc(doc(db, "chats", getState().chat.id), {
      lastMsg: dbLastMsg,
    });

    return { ...dbMessage, files, timestamp: new Date().toString() };
  }
);

export const loadMoreMsg = createAsyncThunk<
  any,
  any,
  { state: { user: userStateType; chat: chatStateType } }
>("chat/loadMoreMsg", async (msgNumber: number, { getState }) => {
  const q = query(
    collection(db, "messages", getState().chat.id, "messages"),
    orderBy("timestamp", "desc"),
    startAfter(
      Timestamp.fromDate(new Date(getState().chat.messages[0].timestamp))
    ),
    limit(msgNumber)
  );

  const querySnapshot = await getDocs(q);
  const returnArr = await Promise.all(
    querySnapshot.docs
      .map(async (doc) => {
        const files = await Promise.all(
          doc.data().filesUrls.map(async (fileUrl: string) => {
            const metadata = await getMetadata(ref(storage, fileUrl));
            return { fileUrl, type: metadata.contentType };
          })
        );
        return {
          ...doc.data(),
          files,
          timestamp: doc.data().timestamp.toDate().toString(),
        };
      })
      .reverse()
  );

  return returnArr;
});

export const markLastMsgAsRead = createAsyncThunk<
  any,
  any,
  { state: { user: userStateType; chat: chatStateType } }
>("chat/markLastMsgAsRead", async (_, { getState }) => {
  await updateDoc(doc(db, "chats", getState().chat.id), {
    "lastMsg.readBy": arrayUnion(auth.currentUser?.uid),
  });
});

export const addUsersToGroup = createAsyncThunk<
  any,
  any,
  { state: { user: userStateType; chat: chatStateType } }
>(
  "chat/addUsersToGroup",
  async (addedUsers: chatStateType["users"], { getState }) => {
    const addedUsersUids = addedUsers.map((user) => user.uid);
    await updateDoc(doc(db, "chats", getState().chat.id), {
      users: arrayUnion(...addedUsersUids),
    });
    Promise.all(
      addedUsersUids.map(async (userUid) => {
        await updateDoc(doc(db, "users", userUid), {
          notifications: arrayUnion({
            timestamp: Timestamp.fromDate(new Date()),
            text: `You have been added to group: ${getState().chat.title} by ${
              getState().user.firstName
            } ${getState().user.lastName}`,
            imgUrl: getState().chat.chatImgUrl || "/defaultGroup.webp",
          }),
        });
      })
    );

    return addedUsers;
  }
);
