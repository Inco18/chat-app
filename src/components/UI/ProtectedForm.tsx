import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/reduxHooks";

const ProtectedForm = (props: { children?: React.ReactNode }) => {
  const navigate = useNavigate();
  const { firstName, status } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (status === "idle" && firstName) navigate("/chats");
  }, [status, firstName]);

  if (status === "loadingUser") return <>Spinner</>;

  if (status === "idle" && !firstName) return <>{props.children}</>;
  else return null;
};

export default ProtectedForm;
