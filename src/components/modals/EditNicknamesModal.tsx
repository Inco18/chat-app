import React, { useRef, useState } from "react";
import defaultImg from "../../assets/default.jpg";
import { ReactComponent as Edit } from "../../assets/edit.svg";
import { ReactComponent as Check } from "../../assets/check.svg";

import styles from "./EditNicknamesModal.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { userStateType } from "../../redux/userSlice";
import { editNickname } from "../../redux/chatActions";

const EditNicknamesModal = () => {
  const [inputOnPerson, setInputOnPerson] = useState<string | undefined>(
    undefined
  );
  const chatState = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  //TODO:
  const handleSubmit = (
    e: React.FormEvent,
    user: (typeof chatState.users)[0]
  ) => {
    e.preventDefault();
    const newNickname = inputRef.current?.value;
    if (!newNickname || newNickname === `${user.firstName} ${user.lastName}`) {
      setInputOnPerson(undefined);
      return;
    }
    dispatch(editNickname({ newNickname, uid: user.uid }));
  };

  return (
    <ul className={styles.container}>
      {chatState.users.map((user) => {
        return (
          <li
            className={styles.person}
            tabIndex={0}
            onClick={() => setInputOnPerson(user.uid)}
            key={user.uid}
          >
            <img
              src={
                user.avatarUrl
                  ? user.avatarUrl
                  : user.sex === "female"
                  ? "/defaultFemale.webp"
                  : "/defaultMale.webp"
              }
            />
            {inputOnPerson !== user.uid && (
              <>
                <p className={styles.name}>
                  {user.firstName} {user.lastName}
                </p>
                <Edit className={styles.editImg} />
              </>
            )}
            {inputOnPerson === user.uid && (
              <>
                <form
                  className={styles.form}
                  onSubmit={(e) => handleSubmit(e, user)}
                >
                  <input
                    type="text"
                    placeholder={user.firstName + " " + user.lastName}
                    className={styles.input}
                    autoFocus
                    ref={inputRef}
                  />
                  <button type="submit" className={styles.submitBtn}>
                    <Check className={`${styles.editImg} ${styles.checkImg}`} />
                  </button>
                </form>
              </>
            )}
          </li>
        );
      })}
      {/* <li
        className={styles.person}
        tabIndex={0}
        id="1"
        onClick={handlePersonClick}
      >
        <img src={defaultImg} />
        {inputOnPerson !== "1" && (
          <>
            <p className={styles.name}>Jan Kowalski</p>
            <Edit className={styles.editImg} />
          </>
        )}
        {inputOnPerson === "1" && (
          <>
            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder={"Jan Kowalski"}
                className={styles.input}
                autoFocus
              />
              <Check
                className={`${styles.editImg} ${styles.checkImg}`}
                onClick={handleSubmit}
              />
            </form>
          </>
        )}
      </li>
      <li
        className={styles.person}
        tabIndex={0}
        id="2"
        onClick={handlePersonClick}
      >
        <img src={defaultImg} />
        {inputOnPerson !== "2" && (
          <>
            <p className={styles.name}>John Paul</p>
            <Edit className={styles.editImg} />
          </>
        )}
        {inputOnPerson === "2" && (
          <>
            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder={"John Paul"}
                className={styles.input}
                autoFocus
              />
              <Check
                className={`${styles.editImg} ${styles.checkImg}`}
                onClick={handleSubmit}
              />
            </form>
          </>
        )}
      </li> */}
    </ul>
  );
};

export default EditNicknamesModal;
