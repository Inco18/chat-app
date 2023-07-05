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
        <span className={styles.number}>3</span>
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
        <span className={styles.number}>35</span>
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
        <span className={styles.number}>12</span>
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
