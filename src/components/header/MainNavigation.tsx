import React, { useEffect, useRef, useState } from "react";
import { useMatch } from "react-router-dom";
import { ReactComponent as Chats } from "../../assets/chats-main.svg";
import { ReactComponent as Settings } from "../../assets/gear.svg";

import styles from "./MainNavigation.module.css";
import { NavLink } from "react-router-dom";

type Props = {};

const MainNavigation = (props: Props) => {
  const chatsRef = useRef<HTMLAnchorElement | null>(null);
  const settingsRef = useRef<HTMLAnchorElement | null>(null);
  const [linksWidths, setLinksWidths] = useState<number[]>([]);
  const [barTransitonEnabled, setBarTransitionEnabled] =
    useState<boolean>(false);

  useEffect(() => {
    document.body.onload = () => {
      if (chatsRef.current && settingsRef.current) {
        setLinksWidths([
          chatsRef.current.clientWidth,
          settingsRef.current.clientWidth,
        ]);
      }
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBarTransitionEnabled(true);
    }, 100);
  }, []);
  const matchChats = useMatch("/chats/*");

  return (
    <nav className={styles.container}>
      <div
        className={`${styles.bar} ${
          barTransitonEnabled ? styles.transition : ""
        }`}
        style={
          matchChats
            ? { width: linksWidths[0] }
            : {
                width: linksWidths[1],
                transform: `translateX(calc(3rem + ${linksWidths[0]}px)`,
              }
        }
      />
      <NavLink
        ref={chatsRef}
        to={"/chats"}
        className={({ isActive }) =>
          (isActive ? styles["active"] : "") + " " + styles["navlink"]
        }
      >
        <Chats
          className={styles.Icon}
          style={{ width: "2.5rem", height: "2.5rem" }}
        />
        <p className={styles.text}>Chats</p>
      </NavLink>

      <NavLink
        ref={settingsRef}
        to={"/settings"}
        className={({ isActive }) =>
          (isActive ? styles["active"] : "") + " " + styles["navlink"]
        }
      >
        <Settings className={styles.Icon} />
        <p className={styles.text}>Settings</p>
      </NavLink>
    </nav>
  );
};

export default MainNavigation;
