import React from "react";

import styles from "./Form.module.css";
import { Link } from "react-router-dom";

const ForgotForm = () => {
  return (
    <form className={styles.form}>
      <h2 className={styles.title}>Send a password reset e-mail</h2>
      <label className={styles.label} style={{ gridColumn: "1/3" }}>
        <span className={styles.labelText}>E-mail:</span>
        <input
          type="email"
          placeholder="Your e-mail"
          className={`${styles.input}`}
        />
      </label>
      <button type="submit" className={styles.signUpButton}>
        Send
      </button>
      <Link to={"/signin"} className={styles.link}>
        Go back to sign in page.
      </Link>
      <Link to={"/signup"} className={styles.link}>
        Go to sign up page.
      </Link>
    </form>
  );
};

export default ForgotForm;
