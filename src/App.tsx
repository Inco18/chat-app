import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import Chat from "./components/chats/chat/Chat";
import { ThemeContext } from "./context/theme-context";
import AllChats from "./pages/AllChats";
import ChatsLayout from "./pages/ChatsLayout";
import RootLayout from "./pages/RootLayout";
import Settings from "./pages/Settings";
import ReactModal from "react-modal";
import Favourites from "./pages/Favourites";
import Archived from "./pages/Archived";
import Blocked from "./pages/Blocked";
import Trash from "./pages/Trash";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./App.module.css";
import { useContext } from "react";
import { SettingsNavContextProvider } from "./context/settingsNavContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "chats",
        element: <ChatsLayout />,
        children: [
          {
            path: "all",
            element: <AllChats />,
            children: [{ path: ":chatId", element: <Chat /> }],
          },
          {
            path: "favourites",
            element: <Favourites />,
            children: [{ path: ":chatId", element: <Chat /> }],
          },
          {
            path: "archived",
            element: <Archived />,
            children: [{ path: ":chatId", element: <Chat /> }],
          },
          {
            path: "blocked",
            element: <Blocked />,
            children: [{ path: ":chatId", element: <Chat /> }],
          },
          {
            path: "trash",
            element: <Trash />,
            children: [{ path: ":chatId", element: <Chat /> }],
          },
          { path: "", element: <Navigate to={"all"} replace /> },
        ],
      },
      {
        path: "settings",
        element: <Navigate to={"general"} replace />,
      },
      {
        path: "settings/*",
        element: (
          <SettingsNavContextProvider>
            <Settings />
          </SettingsNavContextProvider>
        ),
      },
      { path: "", element: <Navigate to={"/chats/all"} replace /> },
    ],
  },
]);

function App() {
  ReactModal.setAppElement("#root");
  const themeCtx = useContext(ThemeContext);
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-left"
        transition={Slide}
        newestOnTop
        theme={themeCtx.theme}
      />
    </>
  );
}

export default App;
