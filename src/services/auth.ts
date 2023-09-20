import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "./firebase";

export const reauthenticate = async (password: string) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("Could not get user");
  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);
};
