import React, { useEffect, useState } from "react";

import styles from "./ChangeThemeModal.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { changeChatTheme } from "../../redux/chatActions";
import Spinner from "../UI/Spinner";
const colors = [
  ["#5852d6", "#6963db", "#837ee4"],
  ["#12dbdb", "#2beeee", "#71f4f4"],
  ["#124bdb", "#2b62ee", "#5a85f2"],
  ["#06007d", "#0900b3", "#0d00ff"],
  ["#ba12db", "#cd2bee", "#d85af2"],
  ["#db129b", "#ee2bb0", "#f25ac2"],
  ["#db1212", "#ee2b2b", "#f25a5a"],
  ["#db4412", "#ee5b2b", "#f2805a"],
  ["#db8112", "#ee962b", "#f2ad5a"],
  ["#b0db12", "#c4ee2b", "#d7f471"],
  ["#47db12", "#5fee2b", "#82f25a"],
  ["#12db66", "#2bee7c", "#5af299"],
  ["#007300", "#009900", "#00cc00"],
  ["#262626", "#404040", "#595959"],
  ["#73000f", "#990014", "#cc001b"],
  ["#7d006a", "#b30098", "#e600c3"],
];

const ChangeThemeModal = () => {
  const dispatch = useAppDispatch();
  const chatState = useAppSelector((state) => state.chat);
  const isLoading = chatState.status === "changingTheme";

  return (
    <div className={styles.themesContainer}>
      {colors.map((color: string[]) => {
        return (
          <button
            className={styles.theme}
            title={color[0]}
            onClick={() => {
              dispatch(changeChatTheme(color));
            }}
            key={color[0]}
          >
            <div
              className={styles.themeColor}
              style={{ backgroundColor: color[0] }}
            />
          </button>
        );
      })}
      {isLoading && (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default ChangeThemeModal;
