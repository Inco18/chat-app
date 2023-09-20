import { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks/reduxHooks";
import { ReactComponent as Check } from "../../../assets/check.svg";
import { ReactComponent as Remove } from "../../../assets/remove.svg";
import { ReactComponent as SmallSpinner } from "../../../assets/spinner.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { changeFirstName } from "../../../redux/userActions";

import styles from "./General.module.css";

const FirstName = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { firstName, status } = useAppSelector((store) => store.user);
  const isChanging = status === "changingFirstName";
  const dispatch = useAppDispatch();
  const { register, handleSubmit, reset } = useForm<{ firstName: string }>({
    defaultValues: { firstName: "" },
  });
  const formRef = useRef(null);

  const close = () => {
    reset();
    setIsEditing(false);
  };
  useOutsideClick([formRef], close);

  const onSubmit: SubmitHandler<{ firstName: string }> = (data) => {
    if (!data.firstName || data.firstName === firstName) close();
    else {
      dispatch(changeFirstName(data.firstName));
    }
  };

  useEffect(() => {
    if (status === "idle" && firstName) close();
  }, [firstName, status]);

  return (
    <>
      <h4 className={styles.fieldName}>First name</h4>
      {!isEditing ? (
        <>
          <p className={styles.fieldValue}>{firstName}</p>
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
            placeholder={firstName}
            className={styles.input}
            autoFocus
            {...register("firstName")}
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

export default FirstName;
