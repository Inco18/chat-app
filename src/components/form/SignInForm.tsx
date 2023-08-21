import { useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";

import styles from "./Form.module.css";
import { signIn } from "../../redux/userActions";

export type signInForm = {
  email: string;
  password: string;
  rememberMe: string | boolean;
};

const SignInForm = () => {
  const { status, firstName } = useAppSelector((state) => state.user);
  const isSigningIn = status === "signingIn";
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signInForm>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<signInForm> = (data) => {
    dispatch(signIn(data));
  };

  useEffect(() => {
    if (firstName) navigate("/chats");
  }, [status, firstName]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.title}>Log in to your account</h2>
      <label className={styles.label} style={{ gridColumn: "1/3" }}>
        <span className={styles.labelText}>E-mail:</span>
        <input
          type="email"
          placeholder="Your e-mail"
          className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
          {...register("email", { required: "This field is required" })}
        />
        {errors.email && (
          <span className={styles.errorMsg}>{errors.email.message}</span>
        )}
      </label>
      <label className={styles.label} style={{ gridColumn: "1/3" }}>
        <span className={styles.labelText}>Password:</span>
        <input
          type="password"
          placeholder="Your password"
          className={`${styles.input} ${
            errors.password ? styles.inputError : ""
          }`}
          {...register("password", { required: "This field is required" })}
        />
        {errors.password && (
          <span className={styles.errorMsg}>{errors.password.message}</span>
        )}
      </label>
      <label className={styles.checkboxLabel} style={{ gridColumn: "1/3" }}>
        <input
          type="checkbox"
          value={"rememberMe"}
          className={`${styles.checkboxInput}`}
          {...register("rememberMe")}
        />
        <span className={styles.labelText}>Remember me</span>
      </label>
      <button
        type="submit"
        className={styles.signUpButton}
        disabled={isSigningIn}
      >
        {isSigningIn ? (
          <span className={styles.loadingButtonText}>Signing in</span>
        ) : (
          "Sign in"
        )}
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
