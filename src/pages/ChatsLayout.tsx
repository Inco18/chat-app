import React from "react";
import { Outlet } from "react-router-dom";
import ChatsMain from "../components/chats/ChatsMain";
import ChatsNavigation from "../components/chats/ChatsNavigation";

type Props = {};

const ChatsLayout = (props: Props) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "calc(100% - 3rem)",
      }}
    >
      <ChatsNavigation />
      <ChatsMain>
        <Outlet />
      </ChatsMain>
    </div>
  );
};

export default ChatsLayout;
