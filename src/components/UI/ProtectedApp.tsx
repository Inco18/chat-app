import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { onAuthStateChanged } from "firebase/auth";
import { loadUser } from "../../redux/userActions";
import { auth } from "../../services/firebase";
import { clearUser } from "../../redux/userSlice";
import Spinner from "./Spinner";

const ProtectedApp = (props: { children?: React.ReactNode }) => {
  const navigate = useNavigate();
  const { firstName, status } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (status !== "afterSignUp") {
          dispatch(loadUser(user.uid));
        }
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (status === "idle" && !firstName) navigate("/signin");
  }, [status, firstName]);

  if (status === "loadingUser") return <Spinner />;

  if (firstName) return <>{props.children}</>;
  else return null;
};

export default ProtectedApp;
