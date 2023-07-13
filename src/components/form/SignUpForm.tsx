import React from "react";

import styles from "./Form.module.css";
import { Link } from "react-router-dom";

const SignUpForm = () => {
  return (
    <form className={styles.form}>
      <h2 className={styles.title}>Create new account</h2>
      <label className={styles.label} style={{ gridRow: "2/3" }}>
        <span className={styles.labelText}>First name:</span>
        <input
          type="text"
          placeholder="Your first name"
          className={`${styles.input}`}
        />
      </label>
      <label className={styles.label} style={{ gridRow: "2/3" }}>
        <span className={styles.labelText}>Last name:</span>
        <input
          type="text"
          placeholder="Your last name"
          className={`${styles.input}`}
        />
      </label>
      <label className={styles.label} style={{ gridColumn: "1/3" }}>
        <span className={styles.labelText}>E-mail:</span>
        <input
          type="email"
          placeholder="Your e-mail"
          className={`${styles.input}`}
        />
      </label>
      <label className={styles.label} style={{ gridColumn: "1/3" }}>
        <span className={styles.labelText}>Password:</span>
        <input
          type="password"
          placeholder="Your password"
          className={`${styles.input}`}
        />
      </label>
      <div style={{ gridColumn: "1/3" }}>
        <span className={styles.labelText}>Date of birth:</span>
        <div className={styles.dateContainer}>
          <label className={styles.label}>
            <span className={styles.labelText} style={{ fontSize: ".8rem" }}>
              Day:
            </span>
            <input
              type="number"
              placeholder="DD"
              min={1}
              max={31}
              className={`${styles.input}`}
            />
          </label>
          <label className={styles.label}>
            <span className={styles.labelText} style={{ fontSize: ".8rem" }}>
              Month:
            </span>
            <input
              type="number"
              placeholder="MM"
              min={1}
              max={12}
              className={`${styles.input}`}
            />
          </label>
          <label className={styles.label}>
            <span className={styles.labelText} style={{ fontSize: ".8rem" }}>
              Year:
            </span>
            <input
              type="number"
              placeholder="YYYY"
              min={1900}
              max={new Date().getFullYear()}
              className={`${styles.input}`}
            />
          </label>
        </div>
      </div>
      <label className={styles.label} style={{ gridColumn: "1/3" }}>
        <span className={styles.labelText}>Sex:</span>
        <div className={styles.radioContainer}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="sex"
              className={`${styles.radioInput}`}
              value={"female"}
            />
            Female
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="sex"
              className={`${styles.radioInput}`}
              value={"male"}
            />
            Male
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="sex"
              className={`${styles.radioInput}`}
              value={"other"}
            />
            Other
          </label>
        </div>
      </label>
      <button type="submit" className={styles.signUpButton}>
        Sign up
      </button>
      <Link to={"/signin"} className={styles.link}>
        Already have an account? Sign in.
      </Link>
    </form>
  );
};

export default SignUpForm;
