import { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks/reduxHooks";
import { ReactComponent as Check } from "../../../assets/check.svg";
import { ReactComponent as Remove } from "../../../assets/remove.svg";
import { ReactComponent as SmallSpinner } from "../../../assets/spinner.svg";

import styles from "./General.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { changeEmail } from "../../../redux/userActions";

const emailRegex =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

const Email = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { email, status } = useAppSelector((store) => store.user);
  const isChanging = status === "changingEmail";
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ newEmail: string; password: string }>({
    defaultValues: { newEmail: "", password: "" },
  });
  const formRef = useRef(null);

  const close = () => {
    reset();
    setIsEditing(false);
  };
  useOutsideClick([formRef], close);

  const onSubmit: SubmitHandler<{ newEmail: string; password: string }> = (
    data
  ) => {
    if (!data.newEmail || !data.password) close();
    else dispatch(changeEmail(data));
  };

  useEffect(() => {
    if (status === "idle" && email) close();
  }, [email, status]);

  return (
    <>
      <h4 className={styles.fieldName}>Email</h4>
      {!isEditing ? (
        <>
          <p className={styles.fieldValue}>{email}</p>
          <button
            className={styles.changeButton}
            onClick={() => setIsEditing(true)}
          >
            Change
          </button>
        </>
      ) : (
        <form
          className={styles.formMultiple}
          onSubmit={handleSubmit(onSubmit)}
          ref={formRef}
        >
          <div className={styles.formFirstLine}>
            <input
              type="password"
              className={styles.input}
              autoFocus
              placeholder="Password"
              {...register("password")}
            />
            {!isChanging && (
              <Remove className={`${styles.checkImg}`} onClick={close} />
            )}
          </div>
          <div className={styles.formSecondLine}>
            <input
              type="text"
              className={`${styles.input} ${
                errors.newEmail ? styles.inputError : ""
              }`}
              placeholder="New email"
              {...register("newEmail", {
                pattern: {
                  value: emailRegex,
                  message: "This is not a valid e-mail address",
                },
              })}
            />
            {isChanging ? (
              <SmallSpinner className={`${styles.smallSpinner}`} />
            ) : (
              <Check
                className={`${styles.checkImg}`}
                onClick={handleSubmit(onSubmit)}
              />
            )}
          </div>
          {errors.newEmail && (
            <span className={styles.errorMsg}>{errors.newEmail.message}</span>
          )}
          <button type="submit" hidden></button>
        </form>
      )}
    </>
  );
};

export default Email;
