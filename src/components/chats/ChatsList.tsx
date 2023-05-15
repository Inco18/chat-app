import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize";
import { ReactComponent as Magnifier } from "../../assets/magnifier.svg";
import { ReactComponent as Arrow } from "../../assets/arrow.svg";
import defaultImg from "../../assets/default.png";

import styles from "./ChatsList.module.css";

const ChatsList = (props: { type: String }) => {
  const [search, setSearch] = useState<string>("");
  const [thinList, setThinList] = useState<boolean>(false);
  const windowSize = useWindowSize();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (windowSize.width) {
      if (windowSize?.width > 1200) setThinList(false);
      else setThinList(true);
    }
  }, [windowSize]);

  return (
    <div className={`${styles.listContainer} ${thinList ? styles.thin : ""}`}>
      <Arrow
        className={styles.arrowIcon}
        onClick={() => setThinList((prev) => !prev)}
      />
      <div className={styles.inputContainer}>
        <Magnifier
          className={styles.inputImg}
          onClick={() => {
            if (!thinList) {
              inputRef.current?.focus();
            } else {
              setTimeout(() => inputRef.current?.focus(), 300);
            }
            setThinList(false);
          }}
        />
        <input
          className={styles.searchInput}
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search"
          ref={inputRef}
        />
      </div>
      <div className={styles.chatsOuter}>
        <div className={styles.chatsInner}>
          <NavLink
            to={"1"}
            className={({ isActive }) =>
              (isActive ? styles["active"] : "") + " " + styles["navlink"]
            }
            title="John Paul"
          >
            <img src={defaultImg} className={styles.profileImg} />
            <div className={styles.profileRightContainer}>
              <p className={styles.name}>John Paul</p>
              <p className={styles.lastMsg}>John sent an image</p>
            </div>
          </NavLink>
          <NavLink
            to={"2"}
            className={({ isActive }) =>
              (isActive ? styles["active"] : "") + " " + styles["navlink"]
            }
            title="Christian Ball"
          >
            <img src={defaultImg} className={styles.profileImg} />
            <div className={styles.profileRightContainer}>
              <p className={styles.name}>Christian Ball</p>
              <p className={styles.lastMsg}>
                You: Some text 43213 21311 dsadas dsa das
              </p>
            </div>
          </NavLink>
          <NavLink
            to={"3"}
            className={({ isActive }) =>
              (isActive ? styles["active"] : "") + " " + styles["navlink"]
            }
            title="Haleema Peters"
          >
            <img src={defaultImg} className={styles.profileImg} />
            <div className={styles.profileRightContainer}>
              <p className={styles.name + " " + styles.unread}>
                Haleema Peters
              </p>
              <p className={styles.lastMsg}>Haleema: Some text</p>
            </div>
            <div className={styles.dot} />
          </NavLink>
          <NavLink
            to={"3"}
            className={({ isActive }) =>
              (isActive ? styles["active"] : "") + " " + styles["navlink"]
            }
            title="Haleema Peters"
          >
            <img src={defaultImg} className={styles.profileImg} />
            <div className={styles.profileRightContainer}>
              <p className={styles.name + " " + styles.unread}>
                Haleema Peters
              </p>
              <p className={styles.lastMsg}>Haleema: Some text</p>
            </div>
            <div className={styles.dot} />
          </NavLink>
          <NavLink
            to={"3"}
            className={({ isActive }) =>
              (isActive ? styles["active"] : "") + " " + styles["navlink"]
            }
            title="Haleema Peters"
          >
            <img src={defaultImg} className={styles.profileImg} />
            <div className={styles.profileRightContainer}>
              <p className={styles.name + " " + styles.unread}>
                Haleema Peters
              </p>
              <p className={styles.lastMsg}>Haleema: Some text</p>
            </div>
            <div className={styles.dot} />
          </NavLink>
          <NavLink
            to={"3"}
            className={({ isActive }) =>
              (isActive ? styles["active"] : "") + " " + styles["navlink"]
            }
            title="Haleema Peters"
          >
            <img src={defaultImg} className={styles.profileImg} />
            <div className={styles.profileRightContainer}>
              <p className={styles.name + " " + styles.unread}>
                Haleema Peters
              </p>
              <p className={styles.lastMsg}>Haleema: Some text</p>
            </div>
            <div className={styles.dot} />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default ChatsList;
