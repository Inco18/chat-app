import { createSlice } from "@reduxjs/toolkit";
import {
  addUsersToGroup,
  changeChatTheme,
  createChat,
  createGroupChat,
  editNickname,
  handleBlock,
  handleDelete,
  handleFavourite,
  handleMute,
  handlePermDelete,
  loadMoreMsg,
  markLastMsgAsRead,
  openChatWithClick,
  openChatWithId,
  sendMessage,
} from "./chatActions";
import { toast } from "react-toastify";

export type chatStateType = {
  status: string;
  id: string;
  messages: {
    timestamp: string;
    sentBy: string;
    text: string;
    gifUrl: string;
    filesUrls: string[];
  }[];
  favourite: string[];
  muted: string[];
  blocked: string[];
  archived: boolean;
  trash: string[];
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
    nicknames: { [key: string]: string };
  };
  lastMsg: {
    readBy: string[];
    value: string;
    sentBy: string;
    timestamp: string;
  };
};

export const initialState: chatStateType = {
  status: "idle",
  id: "",
  messages: [],
  favourite: [],
  muted: [],
  blocked: [],
  trash: [],
  archived: false,
  users: [],
  title: "",
  chatImgUrl: "",
  settings: {
    themeColor: "",
    themeColorLight: "",
    themeColorLightHover: "",
    nicknames: {},
  },
  lastMsg: {
    readBy: [],
    value: "",
    sentBy: "",
    timestamp: "",
  },
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    receiveLastMsg(state, action) {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createChat.pending, (state) => {
        state.status = "creatingChat";
      })
      .addCase(createChat.fulfilled, (state, action) => {
        toast.success("Chat created successfully");
        return { ...action.payload, status: "idle", messages: [] };
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
        return { ...action.payload, status: "idle", messages: [] };
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
          messages: [],
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
          messages: [],
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
      .addCase(editNickname.pending, (state) => {
        state.status = "editingNickname";
      })
      .addCase(editNickname.fulfilled, (state, action) => {
        state.settings.nicknames = {
          ...state.settings.nicknames,
          [action.payload.uid]: action.payload.newNickname,
        };
        state.status = "idle";
        toast.success("Nickname changed successfully");
      })
      .addCase(editNickname.rejected, (state, action) => {
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
      })
      .addCase(handleMute.pending, (state) => {
        state.status = "handlingMute";
      })
      .addCase(handleMute.fulfilled, (state, action) => {
        state.muted = action.payload;
        state.status = "idle";
      })
      .addCase(handleMute.rejected, (state, action) => {
        state.status = "error";
        toast.error("Could not mute: " + action.error.message);
      })
      .addCase(handleBlock.pending, (state) => {
        state.status = "handlingBlock";
      })
      .addCase(handleBlock.fulfilled, (state, action) => {
        state.blocked = action.payload;
        state.favourite = [];
        state.status = "idle";
      })
      .addCase(handleBlock.rejected, (state, action) => {
        state.status = "error";
        toast.error("Could not block: " + action.error.message);
      })
      .addCase(handleDelete.pending, (state) => {
        state.status = "handlingDelete";
      })
      .addCase(handleDelete.fulfilled, (state, action) => {
        state.trash = action.payload.resultArray;
        state.favourite = action.payload.filteredFavourite;
        state.status = "idle";
      })
      .addCase(handleDelete.rejected, (state, action) => {
        state.status = "error";
        toast.error("Could not move to trash: " + action.error.message);
      })
      .addCase(handlePermDelete.pending, (state) => {
        state.status = "handlingPermDelete";
      })
      .addCase(handlePermDelete.fulfilled, (state, action) => {
        toast.success("Chat deleted permanently");
        return { ...initialState, status: "idle" };
      })
      .addCase(handlePermDelete.rejected, (state, action) => {
        state.status = "error";
        toast.error("Could not delete: " + action.error.message);
      })
      .addCase(sendMessage.pending, (state) => {
        state.status = "sendingMessage";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
        state.status = "idle";
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "error";
        toast.error("Could not send message: " + action.error.message);
      })
      .addCase(loadMoreMsg.pending, (state) => {
        state.status = "loadingMessages";
      })
      .addCase(loadMoreMsg.fulfilled, (state, action) => {
        state.messages.unshift(...action.payload);
        state.status = "idle";
      })
      .addCase(loadMoreMsg.rejected, (state, action) => {
        state.status = "error";
        toast.error("Could not load messages: " + action.error.message);
      })
      .addCase(markLastMsgAsRead.pending, (state) => {
        state.status = "markingAsRead";
      })
      .addCase(markLastMsgAsRead.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(markLastMsgAsRead.rejected, (state, action) => {
        state.status = "error";
        toast.error(
          "Could not mark last message as read: " + action.error.message
        );
      })
      .addCase(addUsersToGroup.pending, (state) => {
        state.status = "addingUsers";
      })
      .addCase(addUsersToGroup.fulfilled, (state, action) => {
        state.status = "idle";
        state.users.push(...action.payload);
      })
      .addCase(addUsersToGroup.rejected, (state, action) => {
        state.status = "error";
        toast.error("Could not add users: " + action.error.message);
      });
  },
});

export const { receiveLastMsg } = chatSlice.actions;

export default chatSlice.reducer;
