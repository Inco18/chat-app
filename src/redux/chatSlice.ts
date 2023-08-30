import { createSlice } from "@reduxjs/toolkit";
import {
  changeChatTheme,
  createChat,
  createGroupChat,
  handleFavourite,
  openChatWithClick,
  openChatWithId,
} from "./chatActions";
import { toast } from "react-toastify";

export type chatStateType = {
  status: string;
  id: string;
  messages: { sentAt: Date; sentBy: string; type: string; value: string }[];
  favourite: string[];
  blocked: string[];
  archived: boolean;
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
    themeColorLight: string;
    themeColorLightHover: string;
    nicknames: { uid: string; nickname: string }[];
  };
};

export const initialState: chatStateType = {
  status: "idle",
  id: "",
  messages: [],
  favourite: [],
  blocked: [],
  archived: false,
  users: [],
  title: "",
  chatImgUrl: "",
  settings: {
    themeColor: "",
    themeColorLight: "",
    themeColorLightHover: "",
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
      })
      .addCase(handleFavourite.pending, (state) => {
        state.status = "handlingFavourites";
      })
      .addCase(handleFavourite.fulfilled, (state, action) => {
        state.favourite = action.payload;
        state.status = "idle";
      })
      .addCase(handleFavourite.rejected, (state, action) => {
        state.status = "error";
        toast.error("Could not add to favourites: " + action.error.message);
      })
      .addCase(changeChatTheme.pending, (state) => {
        state.status = "changingTheme";
      })
      .addCase(changeChatTheme.fulfilled, (state, action) => {
        state.settings.themeColor = action.payload[0];
        state.settings.themeColorLight = action.payload[1];
        state.settings.themeColorLightHover = action.payload[2];
        state.status = "idle";
        toast.success("Chat theme changed successfully");
      })
      .addCase(changeChatTheme.rejected, (state, action) => {
        state.status = "error";
        toast.error("Could not change theme: " + action.error.message);
      });
  },
});

export const {} = chatSlice.actions;

export default chatSlice.reducer;
