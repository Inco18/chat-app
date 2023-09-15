import { Timestamp, doc, getDoc } from "firebase/firestore";
import { chatStateType } from "../redux/chatSlice";
import { auth, db } from "./firebase";
import { userStateType } from "../redux/userSlice";
import { signOut } from "firebase/auth";

export const loadUserFromDb = async (userId: string) => {
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
      allowText: data.allowText,
    };
  } else {
    await signOut(auth);
    throw new Error("User informations not found");
  }
};

export const loadChatUsers = async (
  chatData: any,
  currentUser: userStateType
) => {
  let newUsers = [];

  if (!chatData.userInfo) {
    newUsers = await Promise.all(
      chatData.users.map(async (userId: string) => {
        if (userId === auth.currentUser?.uid)
          return {
            uid: auth.currentUser?.uid,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            sex: currentUser.sex,
            avatarUrl: currentUser.avatarUrl,
          };
        const docSnap = await getDoc(doc(db, "users", userId));
        if (docSnap.exists())
          return {
            ...docSnap.data(),
            uid: userId,
            notifications: null,
            birthDate: docSnap.data().birthDate.toDate().toString(),
          };
        else return undefined;
      })
    );
  } else {
    newUsers = [
      {
        uid: auth.currentUser?.uid,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        sex: currentUser.sex,
        avatarUrl: currentUser.avatarUrl,
      },
      { ...chatData.userInfo },
    ];
  }

  return newUsers;
};

export const handleOtherAction = (startingArray: string[]) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Could not get user's id");
  let resultArray = [];
  if (startingArray.includes(userId)) {
    resultArray = startingArray.filter((uid) => {
      return uid !== userId;
    });
  } else {
    resultArray.push(userId);
  }
  return resultArray;
};
