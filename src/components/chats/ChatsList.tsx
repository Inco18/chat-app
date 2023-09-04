import { useEffect, useRef, useState } from "react";
import { NavLink, useMatches, useNavigate } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize";
import { ReactComponent as Magnifier } from "../../assets/magnifier.svg";
import { ReactComponent as Arrow } from "../../assets/arrow.svg";
import { ReactComponent as Group } from "../../assets/group.svg";
import { ReactComponent as SmallSpinner } from "../../assets/spinner.svg";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import Modal from "../modals/Modal";
import GroupChatModal from "../modals/GroupChatModal";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { createChat, openChatWithClick } from "../../redux/chatActions";

import styles from "./ChatsList.module.css";

const ChatsList = () => {
  const [search, setSearch] = useState<string>("");
  const [thinList, setThinList] = useState<boolean>(false);
  const [list, setList] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [groupModalIsOpen, setGroupModalIsOpen] = useState(false);
  const windowSize = useWindowSize();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const matches = useMatches();
  const dispatch = useAppDispatch();
  const chatState = useAppSelector((state) => state.chat);

  useEffect(() => {
    if (windowSize.width) {
      if (windowSize?.width > 1200) setThinList(false);
      else {
        setThinList(true);
        setSearch("");
      }
    }
  }, [windowSize]);

  const q = query(
    collection(db, "chats"),
    where("users", "array-contains", auth.currentUser?.uid)
  );

  const queryUsers = query(
    collection(db, "users"),
    where("fullName", ">=", search.toLowerCase()),
    where("fullName", "<=", search.toLowerCase() + "\uf8ff")
  );

  useEffect(() => {
    if (!search) setUsersList([]);
    const timeout = setTimeout(async () => {
      if (!search) return;
      setIsLoadingUsers(true);
      const querySnapshot = await getDocs(queryUsers);
      const arr = querySnapshot.docs
        .filter((userDocSnap: any) => {
          const userData = userDocSnap.data();
          return (
            userDocSnap.id !== auth.currentUser?.uid &&
            userData.allowText &&
            !list.some((chatEl) => {
              return !chatEl.title && chatEl.users.includes(userDocSnap.id);
            })
          );
        })
        .map((userDocSnap: any) => {
          const userData = userDocSnap.data();
          return {
            id: userDocSnap.id,
            ...userData,
          };
        });
      setUsersList(arr);
      setIsLoadingUsers(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const unsub = onSnapshot(q, (querySnapshot) => {
      Promise.all(
        querySnapshot.docs.map(async (chatDocSnap: any) => {
          const chatData = chatDocSnap.data();
          if (chatData.title) {
            return {
              id: chatDocSnap.id,
              ...chatData,
            };
          } else {
            const otherUserId = chatData.users.filter(
              (id: string) => id !== auth.currentUser?.uid
            )[0];
            let userInfo;
            if (!otherUserId) {
              userInfo = {};
            } else {
              const userDocRef = doc(db, "users", otherUserId);
              const userDocSnap = await getDoc(userDocRef);
              userInfo = {
                uid: otherUserId,
                avatarUrl: userDocSnap.data()?.avatarUrl,
                firstName: userDocSnap.data()?.firstName,
                lastName: userDocSnap.data()?.lastName,
                sex: userDocSnap.data()?.sex,
              };
            }

            return {
              id: chatDocSnap.id,
              userInfo: userInfo,
              ...chatData,
              lastMsg: chatData.lastMsg.value
                ? {
                    ...chatData.lastMsg,
                    timestamp: chatData.lastMsg.timestamp.toDate().toString(),
                  }
                : {},
            };
          }
        })
      ).then((chatsArr) => {
        setList(chatsArr);
        setIsLoadingUsers(false);
      });
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const filtered = list.filter((chat) => {
      if (matches[2].pathname.includes("chats/all"))
        return (
          chat.blocked.length === 0 &&
          !chat.archived &&
          !chat.trash.includes(auth.currentUser?.uid) &&
          ((chat.userInfo &&
            `${chat.userInfo.firstName.toLowerCase()} ${chat.userInfo.lastName.toLowerCase()}`.startsWith(
              search.toLowerCase()
            )) ||
            chat.title.toLowerCase().startsWith(search.toLowerCase()))
        );
      if (matches[2].pathname.includes("chats/favourites"))
        return chat.favourite.includes(auth.currentUser?.uid);
      if (matches[2].pathname.includes("chats/archived")) return chat.archived;
      if (matches[2].pathname.includes("chats/blocked"))
        return chat.blocked.length > 0;
      if (matches[2].pathname.includes("chats/trash"))
        return chat.trash.includes(auth.currentUser?.uid);
    });

    setFilteredList(filtered);
  }, [list, matches[2].pathname, search]);

  const afterChatCreate = (action: any) => {
    navigate(`/chats/all/${action.payload.id}`);
    setSearch("");
    setGroupModalIsOpen(false);
  };

  const onChatCreate = (user: any) => {
    dispatch(createChat(user)).then((action) => {
      afterChatCreate(action);
    });
  };

  return (
    <div className={`${styles.listContainer} ${thinList ? styles.thin : ""}`}>
      <Arrow
        className={styles.arrowIcon}
        onClick={() => {
          setThinList((prev) => !prev);
          setSearch("");
        }}
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
      <button
        className={styles.groupButton}
        onClick={() => setGroupModalIsOpen(true)}
      >
        <Group className={styles.groupButtonIcon} />
        <p>Create a group chat</p>
      </button>
      <Modal
        isOpen={groupModalIsOpen}
        closeFunction={() => setGroupModalIsOpen(false)}
        title={"Create a group chat"}
      >
        <GroupChatModal afterChatCreate={afterChatCreate} />
      </Modal>
      <div className={styles.chatsOuter} id="scrollableDiv">
        <div className={styles.chatsInner}>
          {usersList.length > 0 && filteredList.length > 0 && (
            <p className={styles.listTitle}>Chats</p>
          )}
          {filteredList.map((chat) => {
            return (
              <NavLink
                onClick={() => dispatch(openChatWithClick(chat))}
                to={chat.id}
                className={({ isActive }) =>
                  (isActive ? styles["active"] : "") +
                  " " +
                  styles["navlink"] +
                  " " +
                  (chat.lastMsg.readBy &&
                  !chat.lastMsg.readBy.includes(auth.currentUser?.uid)
                    ? styles.unread
                    : "")
                }
                title={
                  chat.title
                    ? chat.title
                    : `${chat.userInfo.firstName} ${chat.userInfo.lastName}`
                }
                key={chat.id}
              >
                {chat.lastMsg.readBy &&
                  !chat.lastMsg.readBy.includes(auth.currentUser?.uid) && (
                    <div className={styles.dot} />
                  )}
                <img
                  src={
                    chat.title
                      ? chat.chatImgUrl
                        ? chat.chatImgUrl
                        : "/defaultGroup.webp"
                      : chat.userInfo.avatarUrl
                      ? chat.userInfo.avatarUrl
                      : chat.userInfo.sex === "female"
                      ? "/defaultFemale.webp"
                      : "/defaultMale.webp"
                  }
                  className={styles.profileImg}
                />
                <div
                  className={
                    chat.lastMsg.readBy
                      ? styles.profileRightContainer
                      : styles.profileRightContainerNoMsg
                  }
                >
                  <p className={styles.name}>
                    {chat.title
                      ? chat.title
                      : chat.userInfo.firstName
                      ? `${chat.userInfo.firstName} ${chat.userInfo.lastName}`
                      : "Unknown user"}
                  </p>
                  <p className={styles.lastMsg}>{chat.lastMsg.value}</p>
                </div>
              </NavLink>
            );
          })}

          {usersList.length > 0 && (
            <p className={styles.listTitle}>Other users</p>
          )}
          {usersList.map((user) => {
            return (
              <div
                className={styles["navlink"]}
                title={`${user.firstName} ${user.lastName}`}
                key={user.id}
                onClick={() => onChatCreate(user)}
              >
                <img
                  src={
                    user.avatarUrl
                      ? user.avatarUrl
                      : user.sex === "female"
                      ? "/defaultFemale.webp"
                      : "/defaultMale.webp"
                  }
                  className={styles.profileImg}
                />
                <div className={styles.profileRightContainerNoMsg}>
                  <p
                    className={styles.name}
                  >{`${user.firstName} ${user.lastName}`}</p>
                </div>
              </div>
            );
          })}
          {isLoadingUsers && (
            <div className={styles.smallSpinner}>
              <SmallSpinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsList;
