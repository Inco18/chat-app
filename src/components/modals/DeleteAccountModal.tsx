import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { deleteAccount } from "../../redux/userActions";
import { ReactComponent as SmallSpinner } from "../../assets/spinner.svg";

import styles from "./DeleteAccountModal.module.css";

const DeleteAccountModal = (props: { closeFn: () => void }) => {
  const { status } = useAppSelector((state) => state.user);
  const isDeleting = status === "deletingAccount";
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string }>({
    defaultValues: { password: "" },
  });

  const onSubmit: SubmitHandler<{ password: string }> = (data) => {
    dispatch(deleteAccount(data.password));
  };

  return (
    <>
      <p className={styles.deleteModalText}>
        Are you sure you want to delete your account? <br />
        <span className={styles.deleteModalTextBold}>
          This action is permanent!
        </span>
      </p>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <input
          type="password"
          className={`${styles.input} ${
            errors.password ? styles.inputError : ""
          }`}
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
          })}
        />{" "}
        {isDeleting && <SmallSpinner className={styles.smallSpinner} />}
        <button className={styles.modalDeleteButton} disabled={isDeleting}>
          Delete
        </button>
      </form>
      {errors.password && (
        <span className={styles.errorMsg}>{errors.password.message}</span>
      )}
      <div className={styles.deleteModalButtonsContainer}>
        <button
          onClick={props.closeFn}
          className={styles.cancelButton}
          disabled={isDeleting}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default DeleteAccountModal;
