import React from "react";
import { Outlet } from "react-router-dom";
import ChatsList from "../components/chats/ChatsList";

const AllChats = () => {
  return (
    <>
      <ChatsList type={"favourites"} />
      <Outlet />
    </>
  );
};

export default AllChats;
