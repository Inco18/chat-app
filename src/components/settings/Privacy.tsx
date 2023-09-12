import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as Check } from "../../assets/check.svg";
import { ReactComponent as Remove } from "../../assets/remove.svg";
import { ReactComponent as SmallSpinner } from "../../assets/spinner.svg";
import Switch from "react-switch";

import Modal from "../modals/Modal";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  changeAllowText,
  changeEmail,
  changePassword,
} from "../../redux/userActions";
import styles from "./Privacy.module.css";
import { SubmitHandler, useForm } from "react-hook-form";
import useOutsideClick from "../../hooks/useOutsideClick";
import DeleteAccountModal from "../modals/DeleteAccountModal";

const Privacy = () => {
  const [passwordInput, setPasswordInput] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const { status, allowText } = useAppSelector((state) => state.user);
  const isChangingAllowText = status === "changingAllowText";
  const isChangingPassword = status === "changingPassword";
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ oldPassword: string; newPassword: string }>({
    defaultValues: { oldPassword: "", newPassword: "" },
  });
  const formRef = useRef(null);

  const close = () => {
    reset();
    setPasswordInput(false);
  };
  useOutsideClick([formRef], close);

  const onSubmit: SubmitHandler<{
    oldPassword: string;
    newPassword: string;
  }> = (data) => {
    if (!data.oldPassword || !data.newPassword) close();
    else dispatch(changePassword(data));
  };

  useEffect(() => {
    if (status === "idle") close();
  }, [status]);

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
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          ref={formRef}
        >
          <div className={styles.formFirstLine}>
            <input
              type="password"
              className={styles.input}
              autoFocus
              placeholder="Old password"
              {...register("oldPassword")}
            />
            {!isChangingPassword && (
              <Remove className={`${styles.checkImg}`} onClick={close} />
            )}
          </div>
          <div className={styles.formSecondLine}>
            <input
              type="password"
              className={`${styles.input} ${
                errors.newPassword ? styles.inputError : ""
              }`}
              placeholder="New password"
              {...register("newPassword", {
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
              })}
            />
            {isChangingPassword ? (
              <SmallSpinner className={`${styles.smallSpinner}`} />
            ) : (
              <Check
                className={`${styles.checkImg}`}
                onClick={handleSubmit(onSubmit)}
              />
            )}
          </div>
          {errors.newPassword && (
            <span className={styles.errorMsg}>
              {errors.newPassword.message}
            </span>
          )}
          <button type="submit" hidden></button>
        </form>
      )}
      <h4 className={`${styles.fieldName} ${styles.longFieldName}`}>
        <label htmlFor="textSwitch">
          Allow unknown users to text you and make groups with you
        </label>
        {isChangingAllowText && (
          <SmallSpinner className={styles.absoluteSpinner} />
        )}
      </h4>
      <Switch
        checked={allowText}
        onChange={(checked) => dispatch(changeAllowText(checked))}
        offColor="#16171b"
        onColor="#5852d6"
        uncheckedIcon={false}
        checkedIcon={false}
        className={styles.switch}
        id="textSwitch"
        disabled={isChangingAllowText}
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
        <DeleteAccountModal closeFn={() => setDeleteModal(false)} />
      </Modal>
    </div>
  );
};

export default Privacy;
