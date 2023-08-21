import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { signUp } from "../../redux/userActions";
import { useEffect } from "react";

import styles from "./Form.module.css";

export type IFormInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  day: number;
  month: number;
  year: number;
  sex: "female" | "male" | "other";
};
const emailRegex =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

const SignUpForm = () => {
  const { status, firstName } = useAppSelector((state) => state.user);
  const isSigningUp = status === "signingUp";
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    dispatch(signUp(data));
  };

  useEffect(() => {
    if (firstName) navigate("/chats");
  }, [status, firstName]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.title}>Create new account</h2>
      <label className={styles.label} style={{ gridRow: "2/3" }}>
        <span className={styles.labelText}>First name:</span>
        <input
          type="text"
          placeholder="Your first name"
          className={`${styles.input} ${
            errors.firstName ? styles.inputError : ""
          }`}
          {...register("firstName", {
            required: "This field is required",
          })}
        />
        {errors.firstName && (
          <span className={styles.errorMsg}>{errors.firstName.message}</span>
        )}
      </label>
      <label className={styles.label} style={{ gridRow: "2/3" }}>
        <span className={styles.labelText}>Last name:</span>
        <input
          type="text"
          placeholder="Your last name"
          className={`${styles.input} ${
            errors.lastName ? styles.inputError : ""
          }`}
          {...register("lastName", { required: "This field is required" })}
        />{" "}
        {errors.lastName && (
          <span className={styles.errorMsg}>{errors.lastName.message}</span>
        )}
      </label>
      <label className={styles.label} style={{ gridColumn: "1/3" }}>
        <span className={styles.labelText}>E-mail:</span>
        <input
          type="email"
          placeholder="Your e-mail"
          className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: emailRegex,
              message: "This is not a valid e-mail address",
            },
          })}
        />{" "}
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
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
          })}
        />{" "}
        {errors.password && (
          <span className={styles.errorMsg}>{errors.password.message}</span>
        )}
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
              className={`${styles.input} ${
                errors.day ? styles.inputError : ""
              }`}
              {...register("day", {
                required: "This field is required",
                min: { value: 1, message: "Provided number is too low" },
                max: { value: 31, message: "Provided number is too high" },
              })}
            />{" "}
            {errors.day && (
              <span className={styles.errorMsg}>{errors.day.message}</span>
            )}
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
              className={`${styles.input} ${
                errors.month ? styles.inputError : ""
              }`}
              {...register("month", {
                required: "This field is required",
                min: { value: 1, message: "Provided number is too low" },
                max: { value: 12, message: "Provided number is too high" },
              })}
            />{" "}
            {errors.month && (
              <span className={styles.errorMsg}>{errors?.month?.message}</span>
            )}
          </label>
          <label className={styles.label}>
            <span className={styles.labelText} style={{ fontSize: ".8rem" }}>
              Year:
            </span>
            <input
              type="number"
              placeholder="YYYY"
              min={new Date().getFullYear() - 130}
              max={new Date().getFullYear()}
              className={`${styles.input} ${
                errors.year ? styles.inputError : ""
              }`}
              {...register("year", {
                required: "This field is required",
                min: {
                  value: new Date().getFullYear() - 130,
                  message: "Provided number is too low",
                },
                max: {
                  value: new Date().getFullYear(),
                  message: "Provided number is too high",
                },
              })}
            />{" "}
            {errors.year && (
              <span className={styles.errorMsg}>{errors.year.message}</span>
            )}
          </label>
        </div>
      </div>
      <label className={styles.label} style={{ gridColumn: "1/3" }}>
        <span className={styles.labelText}>Sex:</span>
        <div className={styles.radioContainer}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              className={`${styles.radioInput} ${
                errors.sex ? styles.radioInputError : ""
              }`}
              value={"female"}
              {...register("sex", {
                required: "You need to choose one option",
              })}
            />
            Female
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              className={`${styles.radioInput} ${
                errors.sex ? styles.radioInputError : ""
              }`}
              value={"male"}
              {...register("sex", {
                required: "You need to choose one option",
              })}
            />
            Male
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              className={`${styles.radioInput} ${
                errors.sex ? styles.radioInputError : ""
              }`}
              value={"other"}
              {...register("sex", {
                required: "You need to choose one option",
              })}
            />
            Other
          </label>
        </div>
        {errors.sex && (
          <span className={styles.errorMsg}>{errors.sex.message}</span>
        )}
      </label>
      <button
        type="submit"
        className={styles.signUpButton}
        disabled={isSigningUp}
      >
        {isSigningUp ? (
          <span className={styles.loadingButtonText}>Signing up</span>
        ) : (
          "Sign up"
        )}
      </button>
      <Link to={"/signin"} className={styles.link}>
        Already have an account? Sign in.
      </Link>
    </form>
  );
};

export default SignUpForm;
