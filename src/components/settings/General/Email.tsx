import { useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks/reduxHooks";
import { ReactComponent as Check } from "../../../assets/check.svg";
import { ReactComponent as Remove } from "../../../assets/remove.svg";

import styles from "./General.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import useOutsideClick from "../../../hooks/useOutsideClick";

const Email = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { email } = useAppSelector((store) => store.user);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ email: string }>({ defaultValues: { email: "" } });
  const formRef = useRef(null);

  const close = () => {
    reset();
    setIsEditing(false);
  };
  useOutsideClick([formRef], close);

  const onSubmit: SubmitHandler<{ email: string }> = (data) => {
    console.log(data);
    if (!data.email) close();
  };

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
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          ref={formRef}
        >
          <input
            type="text"
            placeholder={email}
            className={styles.input}
            autoFocus
            {...register("email")}
          />
          <Check
            className={`${styles.checkImg}`}
            onClick={handleSubmit(onSubmit)}
          />
          <Remove className={`${styles.checkImg}`} onClick={close} />
        </form>
      )}
    </>
  );
};

export default Email;
