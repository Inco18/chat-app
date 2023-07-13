import React from "react";

import styles from "./Form.module.css";
import { Link } from "react-router-dom";

const SignInForm = () => {
  return (
    <form className={styles.form}>
      <h2 className={styles.title}>Log in to your account</h2>
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
      <label className={styles.checkboxLabel} style={{ gridColumn: "1/3" }}>
        <input
          type="checkbox"
          value={"rememberme"}
          className={`${styles.checkboxInput}`}
        />
        <span className={styles.labelText}>Remember me</span>
      </label>
      <button type="submit" className={styles.signUpButton}>
        Sign in
      </button>
      <Link to={"/signup"} className={styles.link}>
        Don't have an account yet? Sign Up.
      </Link>
      <Link to={"/forgotPassword"} className={styles.forgotLink}>
        Forgot your password?
      </Link>
    </form>
  );
};

export default SignInForm;
