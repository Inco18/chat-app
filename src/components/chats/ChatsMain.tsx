import React, { useEffect, useRef } from "react";

import styles from "./ChatsMain.module.css";
import { useAppSelector } from "../../hooks/reduxHooks";

const ChatsMain = (props: { children?: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chatState = useAppSelector((state) => state.chat);
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
    </main>
  );
};

export default ChatsMain;
