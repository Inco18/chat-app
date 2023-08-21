import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import { IFormInput } from "../components/form/SignUpForm";
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";

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
