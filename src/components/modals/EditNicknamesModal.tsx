import React, { useState } from "react";
import defaultImg from "../../assets/default.jpg";
import { ReactComponent as Edit } from "../../assets/edit.svg";
import { ReactComponent as Check } from "../../assets/check.svg";

import styles from "./EditNicknamesModal.module.css";

const EditNicknamesModal = () => {
  const [inputOnPerson, setInputOnPerson] = useState<string | undefined>(
    undefined
  );

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest(`.${styles.person}`)) {
      setInputOnPerson(undefined);
    }
  };

  const handlePersonClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).nodeName !== "INPUT" &&
      !(e.target as HTMLElement).closest(`.${styles.checkImg}`)
    ) {
      if (
        inputOnPerson ===
        (e.target as HTMLElement).closest(`.${styles.person}`)?.id
      ) {
        setInputOnPerson(undefined);
      } else {
        setInputOnPerson(
          (e.target as HTMLElement).closest(`.${styles.person}`)?.id
        );
      }
    }
  };

  //TODO:
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      (
        (e.target as HTMLElement).closest(`.${styles.form}`)
          ?.children[0] as HTMLInputElement
      ).value
    );
    setInputOnPerson(undefined);
  };

  return (
    <ul className={styles.container} onClick={handleContainerClick}>
      <li
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
      </li>
    </ul>
  );
};

export default EditNicknamesModal;
