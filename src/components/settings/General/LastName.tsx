import { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks/reduxHooks";
import { ReactComponent as Check } from "../../../assets/check.svg";
import { ReactComponent as Remove } from "../../../assets/remove.svg";
import { ReactComponent as SmallSpinner } from "../../../assets/spinner.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { changeLastName } from "../../../redux/userActions";

import styles from "./General.module.css";

const LastName = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { lastName, status } = useAppSelector((store) => store.user);
  const isChanging = status === "changingLastName";
  const dispatch = useAppDispatch();
  const { register, handleSubmit, reset } = useForm<{ lastName: string }>({
    defaultValues: { lastName: "" },
  });
  const formRef = useRef(null);

  const close = () => {
    reset();
    setIsEditing(false);
  };
  useOutsideClick([formRef], close);

  const onSubmit: SubmitHandler<{ lastName: string }> = (data) => {
    if (!data.lastName) close();
    else {
      dispatch(changeLastName(data.lastName));
    }
  };

  useEffect(() => {
    if (status === "idle" && lastName) close();
  }, [lastName, status]);

  return (
    <>
      <h4 className={styles.fieldName}>Last name</h4>
      {!isEditing ? (
        <>
          <p className={styles.fieldValue}>{lastName}</p>
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
            placeholder={lastName}
            className={styles.input}
            autoFocus
            {...register("lastName")}
          />
          {isChanging ? (
            <SmallSpinner className={`${styles.smallSpinner}`} />
          ) : (
            <Check
              className={`${styles.checkImg}`}
              onClick={handleSubmit(onSubmit)}
            />
          )}
          {!isChanging && (
            <Remove className={`${styles.checkImg}`} onClick={close} />
          )}
        </form>
      )}
    </>
  );
};

export default LastName;
