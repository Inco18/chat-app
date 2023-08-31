import React, { useRef, useState } from "react";
import { ReactComponent as Edit } from "../../assets/edit.svg";
import { ReactComponent as Check } from "../../assets/check.svg";
import { ReactComponent as SmallSpinner } from "../../assets/spinner.svg";

import styles from "./EditNicknamesModal.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { editNickname } from "../../redux/chatActions";

const EditNicknamesModal = () => {
  const [inputOnPerson, setInputOnPerson] = useState<string | undefined>(
    undefined
  );
  const chatState = useAppSelector((state) => state.chat);
  const isLoading = chatState.status === "editingNickname";
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

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
    dispatch(editNickname({ newNickname, uid: user.uid })).then(() =>
      setInputOnPerson(undefined)
    );
  };

  return (
    <ul className={styles.container}>
      {chatState.users.map((user) => {
        const userNickname: string = chatState.settings.nicknames[user.uid];
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
                  {userNickname
                    ? userNickname
                    : `${user.firstName} ${user.lastName}`}
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
                    placeholder={
                      userNickname
                        ? userNickname
                        : `${user.firstName} ${user.lastName}`
                    }
                    className={styles.input}
                    autoFocus
                    ref={inputRef}
                  />
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isLoading}
                  >
                    {!isLoading ? (
                      <Check
                        className={`${styles.editImg} ${styles.checkImg}`}
                      />
                    ) : (
                      <SmallSpinner
                        className={`${styles.editImg} ${styles.checkImg}`}
                      />
                    )}
                  </button>
                </form>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default EditNicknamesModal;
