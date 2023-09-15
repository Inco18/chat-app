import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { ReactComponent as SmallSpinner } from "../../assets/spinner.svg";
import styles from "./ParticipantsModal.module.css";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../services/firebase";
import { addUsersToGroup } from "../../redux/chatActions";

const ParticipantsModal = (props: { closeFunction: () => void }) => {
  const { users, status } = useAppSelector((state) => state.chat);
  const isAdding = status == "addingUsers";
  const dispatch = useAppDispatch();
  const [usersSearch, setUsersSearch] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersResults, setUserResults] = useState<any[]>([]);
  const [addedUsers, setAddedUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!usersSearch) setUserResults([]);
    const timeout = setTimeout(async () => {
      if (!usersSearch) return;
      const queryUsers = query(
        collection(db, "users"),
        where("fullName", ">=", usersSearch.toLowerCase()),
        where("fullName", "<=", usersSearch.toLowerCase() + "\uf8ff")
      );
      setIsLoadingUsers(true);
      const querySnapshot = await getDocs(queryUsers);
      const arr = querySnapshot.docs
        .filter((userDocSnap: any) => {
          const userData = userDocSnap.data();
          return (
            userDocSnap.id !== auth.currentUser?.uid &&
            userData.allowText &&
            !addedUsers.some((user) => {
              return user.uid === userDocSnap.id;
            }) &&
            !users.some((user) => {
              return user.uid === userDocSnap.id;
            })
          );
        })
        .map((userDocSnap: any) => {
          const userData = userDocSnap.data();
          return {
            uid: userDocSnap.id,
            ...userData,
          };
        });
      setUserResults(arr);
      setIsLoadingUsers(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [usersSearch]);

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <h4>Participants list</h4>
        <ul className={styles.usersList}>
          {users.map((user) => {
            return (
              <li key={user.uid} className={styles.user}>
                <img
                  src={
                    user.avatarUrl
                      ? user.avatarUrl
                      : user.sex === "female"
                      ? "/defaultFemale.webp"
                      : "/defaultMale.webp"
                  }
                  className={styles.img}
                />
                <p>
                  {user.firstName} {user.lastName}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={styles.containerLine} />
      <div className={styles.rightContainer}>
        <h4>Add new users</h4>
        <div className={styles.usersContainer}>
          <label>
            Search users:
            <br />
            <input
              type="text"
              className={styles.input}
              onChange={(e) => setUsersSearch(e.target.value)}
            />
          </label>
          <div className={styles.searchResults}>
            {isLoadingUsers && (
              <div className={styles.smallSpinner}>
                <SmallSpinner />
              </div>
            )}
            {usersResults.map((user) => {
              return (
                <div
                  className={styles.resultUser}
                  key={user.uid}
                  onClick={() =>
                    setAddedUsers((prev) =>
                      prev.some((prevUser) => prevUser.uid === user.uid)
                        ? prev
                        : [...prev, user]
                    )
                  }
                >
                  <img
                    src={
                      user.avatarUrl
                        ? user.avatarUrl
                        : user.sex === "female"
                        ? "/defaultFemale.webp"
                        : "/defaultMale.webp"
                    }
                    className={styles.img}
                  />
                  <p>
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              );
            })}
          </div>
          <div className={styles.addedUsersList}>
            Added users:
            {addedUsers.map((user) => {
              return (
                <div
                  className={styles.resultUser}
                  key={"A" + user.uid}
                  onClick={() =>
                    setAddedUsers((prev) =>
                      prev.filter((prevUser) => prevUser.uid !== user.uid)
                    )
                  }
                >
                  <img
                    src={
                      user.avatarUrl
                        ? user.avatarUrl
                        : user.sex === "female"
                        ? "/defaultFemale.webp"
                        : "/defaultMale.webp"
                    }
                    className={styles.img}
                  />
                  <p>
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isAdding}
          onClick={() =>
            dispatch(addUsersToGroup(addedUsers)).then(() => {
              props.closeFunction();
            })
          }
        >
          {isAdding ? (
            <span className={styles.loadingButtonText}>Adding</span>
          ) : (
            "Add"
          )}
        </button>
      </div>
    </div>
  );
};

export default ParticipantsModal;
