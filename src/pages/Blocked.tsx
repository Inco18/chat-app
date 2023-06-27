import React from "react";
import { Outlet } from "react-router-dom";
import ChatsList from "../components/chats/ChatsList";

const AllChats = () => {
  return (
    <>
      <ChatsList type={"blocked"} />
      <Outlet />
    </>
  );
};

export default AllChats;
