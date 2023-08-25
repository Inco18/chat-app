import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ReactComponent as Star } from "../../assets/star.svg";
import { ReactComponent as Chats } from "../../assets/chats-side.svg";
import { ReactComponent as Archived } from "../../assets/archived.svg";
import { ReactComponent as Blocked } from "../../assets/blocked.svg";
import { ReactComponent as Trash } from "../../assets/trash.svg";

import styles from "./ChatsNavigation.module.css";
import SideNav from "../UI/SideNav";

const ChatsNavigation = () => {
  return (
    <SideNav>
      <NavLink
        title="Favourites"
        to={"favourites"}
        className={({ isActive }) =>
          (isActive ? styles["active"] : "") + " " + styles["navlink"]
        }
      >
        <div className={styles.left}>
          <Star className={styles.icon} />
          Favourites
        </div>
      </NavLink>
      <NavLink
        title="All"
        to={"all"}
        className={({ isActive }) =>
          (isActive ? styles["active"] : "") + " " + styles["navlink"]
        }
      >
        <div className={styles.left}>
          <Chats className={styles.icon} />
          All
        </div>
      </NavLink>
      <NavLink
        title="Archived"
        to={"archived"}
        className={({ isActive }) =>
          (isActive ? styles["active"] : "") + " " + styles["navlink"]
        }
      >
        <div className={styles.left}>
          <Archived className={styles.icon} />
          Archived
        </div>
      </NavLink>
      <NavLink
        title="Blocked"
        to={"blocked"}
        className={({ isActive }) =>
          (isActive ? styles["active"] : "") + " " + styles["navlink"]
        }
      >
        <div className={styles.left}>
          <Blocked className={styles.icon} />
          Blocked
        </div>
      </NavLink>
      <NavLink
        title="Trash"
        to={"trash"}
        className={({ isActive }) =>
          (isActive ? styles["active"] : "") + " " + styles["navlink"]
        }
      >
        <div className={styles.left}>
          <Trash className={styles.icon} />
          Trash
        </div>
      </NavLink>
    </SideNav>
  );
};

export default ChatsNavigation;
