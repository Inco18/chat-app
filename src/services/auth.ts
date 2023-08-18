import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import { IFormInput } from "../components/form/SignUpForm";
import { Timestamp, doc, setDoc } from "firebase/firestore";
