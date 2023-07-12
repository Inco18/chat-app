import React, { useState } from "react";
import { ReactComponent as Check } from "../../assets/check.svg";
import { ReactComponent as Remove } from "../../assets/remove.svg";
import Switch from "react-switch";

import styles from "./Privacy.module.css";
import Modal from "../modals/Modal";

const Privacy = () => {
  const [passwordInput, setPasswordInput] = useState(false);
  const [switchState, setSwitchState] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e);
    setPasswordInput(false);
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.fieldName}>Password</h4>
      {!passwordInput ? (
        <>
          <p className={styles.fieldValue}>*********</p>
          <button
            className={styles.changeButton}
            onClick={() => setPasswordInput(true)}
          >
            Change
          </button>
        </>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formFirstLine}>
            <input
              type="password"
              className={styles.input}
              autoFocus
              placeholder="Old password"
            />
            <Remove
              className={`${styles.checkImg}`}
              onClick={() => setPasswordInput(false)}
            />
          </div>
          <div className={styles.formSecondLine}>
            <input
              type="password"
              className={styles.input}
              placeholder="New password"
            />
            <Check className={`${styles.checkImg}`} onClick={handleSubmit} />
          </div>
          <button type="submit" hidden></button>
        </form>
      )}
      <h4 className={`${styles.fieldName} ${styles.longFieldName}`}>
        <label htmlFor="textSwitch">Allow unknown users to text you</label>
      </h4>
      <Switch
        checked={switchState}
        onChange={(checked) => setSwitchState(checked)}
        offColor="#16171b"
        onColor="#5852d6"
        uncheckedIcon={false}
        checkedIcon={false}
        className={styles.switch}
        id="textSwitch"
      />
      <h4 className={styles.fieldName}>Delete your account</h4>
      <button
        className={styles.changeButton}
        onClick={() => setDeleteModal(true)}
      >
        Delete
      </button>
      <Modal
        isOpen={deleteModal}
        closeFunction={() => setDeleteModal(false)}
        title={""}
      >
        <p className={styles.deleteModalText}>
          Are you sure you want to delete your account? <br />
          <span className={styles.deleteModalTextBold}>
            This action is permanent!
          </span>
        </p>
        <div className={styles.deleteModalButtonsContainer}>
          <button
            onClick={() => setDeleteModal(false)}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button className={styles.modalDeleteButton}>Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default Privacy;
