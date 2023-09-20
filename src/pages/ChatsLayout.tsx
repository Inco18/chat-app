import { Outlet } from "react-router-dom";
import ChatsMain from "../components/chats/ChatsMain";
import ChatsNavigation from "../components/chats/ChatsNavigation";

const ChatsLayout = () => {
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
