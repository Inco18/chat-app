import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize";
import { ReactComponent as Magnifier } from "../../assets/magnifier.svg";
import { ReactComponent as Arrow } from "../../assets/arrow.svg";

import styles from "./ChatsList.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../services/firebase";

const ChatsList = (props: { type: String }) => {
  const [search, setSearch] = useState<string>("");
  const [thinList, setThinList] = useState<boolean>(false);
  const [list, setList] = useState<any[]>([]);
  const windowSize = useWindowSize();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (windowSize.width) {
      if (windowSize?.width > 1200) setThinList(false);
      else setThinList(true);
    }
  }, [windowSize]);

  const q = query(
    collection(db, "chats"),
    where("users", "array-contains", auth.currentUser?.uid)
  );

  useEffect(() => {
    const unsub = onSnapshot(q, (querySnapshot) => {
      console.log(querySnapshot.docChanges());
      Promise.all(
        querySnapshot.docs.map(async (chatDocSnap: any) => {
          const chatData = chatDocSnap.data();

          const otherUserId = chatData.users.filter(
            (id: string) => id !== auth.currentUser?.uid
          )[0];
          const userDocRef = doc(db, "users", otherUserId);
          const userDocSnap = await getDoc(userDocRef);
          console.log("reqUser");

          return {
            id: chatDocSnap.id,
            userInfo: {
              id: otherUserId,
              img: userDocSnap.data()?.avatarUrl,
              firstName: userDocSnap.data()?.firstName,
              lastName: userDocSnap.data()?.lastName,
              sex: userDocSnap.data()?.sex,
            },
            ...chatData,
          };
        })
      ).then((chatsArr) => {
        setList(chatsArr);
      });
      console.log("reqSnap");
    });

    return () => unsub();
  }, []);

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
      <div className={styles.chatsOuter} id="scrollableDiv">
        <div className={styles.chatsInner}>
          <InfiniteScroll
            next={() => {}}
            hasMore={true}
            loader={<span>Loading</span>}
            dataLength={1}
            scrollableTarget="scrollableDiv"
          >
            {list.map((chat) => {
              return (
                <NavLink
                  to={chat.id}
                  className={({ isActive }) =>
                    (isActive ? styles["active"] : "") + " " + styles["navlink"]
                  }
                  title={`${chat.userInfo.firstName} ${chat.userInfo.lastName}`}
                  key={chat.id}
                >
                  <img
                    src={
                      chat.userInfo.img
                        ? chat.userInfo.img
                        : chat.userInfo.sex === "female"
                        ? "/defaultFemale.webp"
                        : "/defaultMale.webp"
                    }
                    className={styles.profileImg}
                  />
                  <div className={styles.profileRightContainer}>
                    <p
                      className={styles.name}
                    >{`${chat.userInfo.firstName} ${chat.userInfo.lastName}`}</p>
                    <p className={styles.lastMsg}>{chat.lastMsg.value}</p>
                  </div>
                </NavLink>
              );
            })}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default ChatsList;
