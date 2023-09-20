import React, { useEffect, useRef } from "react";
import { useAppSelector } from "../../hooks/reduxHooks";
import { useParams } from "react-router-dom";

import styles from "./ChatsMain.module.css";

const ChatsMain = (props: { children?: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chatState = useAppSelector((state) => state.chat);
  const params = useParams();
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--accent-main",
        chatState.settings.themeColor
      );
      containerRef.current.style.setProperty(
        "--accent-main-light",
        chatState.settings.themeColorLight
      );
      containerRef.current.style.setProperty(
        "--accent-main-light-hover",
        chatState.settings.themeColorLightHover
      );
    }
  }, [chatState.settings.themeColor]);

  return (
    <main className={styles.mainContainer} ref={containerRef}>
      {props.children}
      {!params.chatId && (
        <p className={styles.noChatMsg}>
          Pick a chat from the list or start a new one
        </p>
      )}
    </main>
  );
};

export default ChatsMain;
