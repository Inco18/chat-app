import React from "react";

import styles from "./AddEventModal.module.css";

const AddEventModal = () => {
  return (
    <form className={styles.form}>
      <label htmlFor="name">
        Event name
        <input type="text" id="name" placeholder="Meeting" />
      </label>
      <label htmlFor="date">
        Event date
        <input type="datetime-local" id="date" />
      </label>
      <button type="submit" className={styles.submitButton}>
        Add
      </button>
    </form>
  );
};

export default AddEventModal;
