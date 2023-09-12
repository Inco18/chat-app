import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  signUp,
  clearUser as clearUserAction,
  loadUser,
  signIn,
  logout,
  changeFirstName,
  changeLastName,
  changeAllowText,
  changeEmail,
  changePassword,
  deleteAccount,
  uploadProfileImg,
  deleteProfileImg,
} from "./userActions";

export type userStateType = {
  firstName: string;
  lastName: string;
  sex: string;
  birthDate: string;
  status: string;
  avatarUrl: string | null;
  email: string;
  allowText: boolean;
};

export const initialState: userStateType = {
  firstName: "",
  lastName: "",
  sex: "",
  birthDate: "",
  status: "loadingUser",
  avatarUrl: null,
  email: "",
  allowText: true,
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
        state.email = action.payload.email;
        state.status = "afterSignUp";

        toast.success("Signed up successfully", { autoClose: 3000 });
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = "error";
        toast.error("Could not create this account: " + action.error.message);
      })
      .addCase(signIn.pending, (state) => {
        state.status = "signingIn";
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.birthDate = action.payload.birthDate;
        state.sex = action.payload.sex;
        state.avatarUrl = action.payload.avatarUrl;
        state.email = action.payload.email;
        state.allowText = action.payload.allowText || true;
        state.status = "afterSignIn";
        toast.success("Signed in successfully", { autoClose: 3000 });
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = "error";
        toast.error("Could not sign in: " + action.error.message);
      })
      .addCase(logout.pending, (state) => {
        state.status = "loggingOut";
      })
      .addCase(logout.fulfilled, (state) => {
        state = { ...initialState, status: "idle" };
        toast.success("Logged out successfully", { autoClose: 3000 });
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "error";
        toast.success("Could not log out: " + action.error.message, {
          autoClose: 3000,
        });
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
        state.email = action.payload.email;
        state.allowText = action.payload.allowText;
        state.status = "idle";
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.status = "errorLoading";
        toast.error("Error loading user: " + action.error.message);
      })
      .addCase(changeFirstName.pending, (state) => {
        state.status = "changingFirstName";
      })
      .addCase(changeFirstName.fulfilled, (state, action) => {
        state.status = "idle";
        state.firstName = action.payload.firstName;
        toast.success("First name changed successfully");
      })
      .addCase(changeFirstName.rejected, (state, action) => {
        state.status = "idle";
        toast.error("Could not change first name: " + action.error.message);
      })
      .addCase(changeLastName.pending, (state) => {
        state.status = "changingLastName";
      })
      .addCase(changeLastName.fulfilled, (state, action) => {
        state.status = "idle";
        state.lastName = action.payload.lastName;
        toast.success("Last name changed successfully");
      })
      .addCase(changeLastName.rejected, (state, action) => {
        state.status = "idle";
        toast.error("Could not change last name: " + action.error.message);
      })
      .addCase(changeEmail.pending, (state) => {
        state.status = "changingEmail";
      })
      .addCase(changeEmail.fulfilled, (state, action) => {
        state.status = "idle";
        state.email = action.payload;
        toast.success("Email changed successfully");
      })
      .addCase(changeEmail.rejected, (state, action) => {
        state.status = "idle";
        toast.error("Could not change email: " + action.error.message);
      })
      .addCase(uploadProfileImg.pending, (state) => {
        state.status = "uploadingProfileImg";
      })
      .addCase(uploadProfileImg.fulfilled, (state, action) => {
        state.status = "idle";
        state.avatarUrl = action.payload;
        toast.success("Profile image uploaded successfully");
      })
      .addCase(uploadProfileImg.rejected, (state, action) => {
        state.status = "idle";
        toast.error("Could not upload profile image: " + action.error.message);
      })
      .addCase(deleteProfileImg.pending, (state) => {
        state.status = "deletingProfileImg";
      })
      .addCase(deleteProfileImg.fulfilled, (state) => {
        state.status = "idle";
        state.avatarUrl = null;
        toast.success("Profile image deleted successfully");
      })
      .addCase(deleteProfileImg.rejected, (state, action) => {
        state.status = "idle";
        toast.error("Could not delete profile image: " + action.error.message);
      })
      .addCase(changePassword.pending, (state) => {
        state.status = "changingPassword";
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.status = "idle";
        toast.success("Password changed successfully");
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = "idle";
        toast.error("Could not change password: " + action.error.message);
      })
      .addCase(changeAllowText.pending, (state) => {
        state.status = "changingAllowText";
      })
      .addCase(changeAllowText.fulfilled, (state, action) => {
        state.status = "idle";
        state.allowText = action.payload.allowText;
        toast.success(
          action.payload.allowText
            ? "Allowed unknown users to text you"
            : "Forbid unknown users from texting you"
        );
      })
      .addCase(changeAllowText.rejected, (state, action) => {
        state.status = "idle";
        toast.error("Could not change value: " + action.error.message);
      })
      .addCase(deleteAccount.pending, (state) => {
        state.status = "deletingAccount";
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.status = "idle";
        toast.success("Account has been deleted");
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.status = "idle";
        toast.error("Could not delete account: " + action.error.message);
      }),
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
