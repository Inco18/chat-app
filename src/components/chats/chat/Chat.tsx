import React, { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import defaultImg from "../../../assets/default.png";
import { ReactComponent as Dots } from "../../../assets/three-dots.svg";
import { ReactComponent as Magnifier } from "../../../assets/magnifier.svg";
import { ReactComponent as Arrow } from "../../../assets/arrow.svg";
import { ReactComponent as Close } from "../../../assets/remove.svg";

import styles from "./Chat.module.css";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import ChatSidebar from "./ChatSidebar";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../../hooks/reduxHooks";

const sidebarClassnames = {
  enter: styles.sidebarEnter,
  enterActive: styles.sidebarEnterActive,
  exit: styles.sidebarExit,
  exitActive: styles.sidebarExitActive,
};

const Chat = () => {
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [searchInputVisible, setSearchInputVisible] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const chat = useAppSelector((state) => state.chat);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <img src={defaultImg} />
            <p>
              <span>Conversation with</span>{" "}
              <span className={styles.bold}>
                {chat.users[1].firstName} {chat.users[1].lastName}
              </span>
            </p>
          </div>
          <Dots
            className={styles.dots}
            onClick={() => setSidebarVisible((prev) => !prev)}
          />
        </div>

        {searchInputVisible && (
          <div className={styles.searchContainer}>
            <form className={styles.searchForm}>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search"
                />
                <button type="submit" className={styles.submitButton}>
                  <Magnifier className={styles.buttonIcon} />
                </button>
              </div>
            </form>
            <div className={styles.searchRightContainer}>
              <p className={styles.foundNumber}>Found: 5</p>
              <Arrow
                style={{
                  transform: "rotate(90deg)",
                  color: "var(--accent-main)",
                  opacity: 1,
                  cursor: "pointer",
                }}
                className={styles.arrow}
              />
              <Arrow
                style={{ transform: "rotate(-90deg)" }}
                className={styles.arrow}
              />
              <Close
                className={styles.closeIcon}
                onClick={() => setSearchInputVisible(false)}
              />
            </div>
          </div>
        )}

        <Messages />
        {!pathname.includes("archived") &&
        !pathname.includes("blocked") &&
        !pathname.includes("trash") ? (
          <ChatInput />
        ) : (
          <p className={styles.chatInputHidden}>
            You cannot send any messages in this chat
          </p>
        )}
      </div>

      <CSSTransition
        in={sidebarVisible}
        nodeRef={sidebarRef}
        timeout={500}
        classNames={sidebarClassnames}
        unmountOnExit
      >
        <ChatSidebar
          ref={sidebarRef}
          className={styles.sidebar}
          toggleSearchInput={() => setSearchInputVisible((prev) => !prev)}
        />
      </CSSTransition>
    </>
  );
};

export default Chat;
