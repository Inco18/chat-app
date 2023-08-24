import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import Chat from "./components/chats/chat/Chat";
import { ThemeContext } from "./context/theme-context";
import AllChats from "./pages/Chats";
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
import { useContext, useEffect } from "react";
import { SettingsNavContextProvider } from "./context/settingsNavContext";
import FormLayout from "./pages/FormLayout";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedApp from "./components/UI/ProtectedApp";
import ProtectedForm from "./components/UI/ProtectedForm";
import { useAppDispatch } from "./hooks/reduxHooks";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { clearUser } from "./redux/userSlice";
import { loadUser, signUp } from "./redux/userActions";
import { isPending } from "@reduxjs/toolkit";
import Chats from "./pages/Chats";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedApp>
        <RootLayout />
      </ProtectedApp>
    ),
    children: [
      {
        path: "chats",
        element: <ChatsLayout />,
        children: [
          {
            path: "all",
            element: <Chats />,
            children: [{ path: ":chatId", element: <Chat /> }],
          },
          {
            path: "favourites",
            element: <Chats />,
            children: [{ path: ":chatId", element: <Chat /> }],
          },
          {
            path: "archived",
            element: <Chats />,
            children: [{ path: ":chatId", element: <Chat /> }],
          },
          {
            path: "blocked",
            element: <Chats />,
            children: [{ path: ":chatId", element: <Chat /> }],
          },
          {
            path: "trash",
            element: <Chats />,
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
  {
    path: "/",
    element: <FormLayout />,
    children: [
      { path: "signup", element: <SignUp /> },
      { path: "signin", element: <SignIn /> },
      { path: "forgotPassword", element: <ForgotPassword /> },
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
