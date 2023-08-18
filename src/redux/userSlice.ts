import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { signUp, clearUser as clearUserAction, loadUser } from "./userActions";

export type userStateType = {
  firstName: string;
  lastName: string;
  sex: string;
  birthDate: string;
  notifications: string[];
  status: string;
  avatarUrl: string | null;
};

export const initialState: userStateType = {
  firstName: "",
  lastName: "",
  sex: "",
  birthDate: "",
  notifications: [],
  status: "loadingUser",
  avatarUrl: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: { clearUser: clearUserAction },
  extraReducers: (builder) =>
    builder
      .addCase(signUp.pending, (state) => {
        state.status = "signingUp";
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.sex = action.payload.sex;
        state.birthDate = action.payload.birthDate;
        state.status = "afterSignUp";
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = "error";
        toast.error("Could not create this account: " + action.error.message);
      })
      .addCase(loadUser.pending, (state) => {
        state.status = "loadingUser";
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.birthDate = action.payload.birthDate;
        state.sex = action.payload.sex;
        state.avatarUrl = action.payload.avatarUrl;
        state.notifications = action.payload.notifications;
        state.status = "idle";
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.status = "error";
        toast.error("Error loading user: " + action.error.message);
      }),
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
