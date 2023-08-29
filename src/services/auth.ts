import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import { IFormInput } from "../components/form/SignUpForm";
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";

export const reauthenticate = async (password: string) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("Could not get user");
  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);
};
