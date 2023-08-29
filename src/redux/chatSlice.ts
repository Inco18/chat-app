import { createSlice } from "@reduxjs/toolkit";
import {
  createChat,
  createGroupChat,
  openChatWithClick,
  openChatWithId,
} from "./chatActions";
import { toast } from "react-toastify";

export type chatStateType = {
  status: string;
  id: string;
  messages: { sentAt: Date; sentBy: string; type: string; value: string }[];
  users: {
    firstName: string;
    lastName: string;
    sex: string;
    avatarUrl: string;
    uid: string;
  }[];
  title: string;
  chatImgUrl: string;
  settings: {
    themeColor: string;
    nicknames: { uid: string; nickname: string }[];
  };
};

export const initialState: chatStateType = {
  status: "idle",
  id: "",
  messages: [],
  users: [],
  title: "",
  chatImgUrl: "",
  settings: {
    themeColor: "",
    nicknames: [],
  },
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createChat.pending, (state) => {
        state.status = "creatingChat";
      })
      .addCase(createChat.fulfilled, (state, action) => {
        toast.success("Chat created successfully");
        return { ...action.payload, status: "idle" };
      })
      .addCase(createChat.rejected, (state, action) => {
        state.status = "error";
        toast.error("Could not create chat: " + action.error.message);
      })
      .addCase(createGroupChat.pending, (state) => {
        state.status = "creatingGroupChat";
      })
      .addCase(createGroupChat.fulfilled, (state, action) => {
        toast.success("Group chat created successfully");
        return { ...action.payload, status: "idle" };
      })
      .addCase(createGroupChat.rejected, (state, action) => {
        state.status = "error";
        toast.error("Could not create group chat: " + action.error.message);
      })
      .addCase(openChatWithClick.pending, (state) => {
        state.status = "openingChat";
      })
      .addCase(openChatWithClick.fulfilled, (state, action) => {
        return {
          ...action.payload,
          status: "idle",
        };
      })
      .addCase(openChatWithClick.rejected, (state, action) => {
        state.status = "error";
        toast.error("Could not open chat: " + action.error.message);
      })
      .addCase(openChatWithId.pending, (state) => {
        state.status = "openingChat";
      })
      .addCase(openChatWithId.fulfilled, (state, action) => {
        return {
          ...action.payload,
          status: "idle",
        };
      })
      .addCase(openChatWithId.rejected, (state, action) => {
        state.status = "error";
        toast.error("Could not open chat: " + action.error.message);
      });
  },
});

export const {} = chatSlice.actions;

export default chatSlice.reducer;
