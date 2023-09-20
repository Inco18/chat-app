import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useAppSelector } from "../../hooks/reduxHooks";
import { db } from "../../services/firebase";
import { toast } from "react-toastify";
import { ReactComponent as SmallSpinner } from "../../assets/spinner.svg";

import styles from "./AddEventModal.module.css";

const AddEventModal = (props: { closeFn: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const chatState = useAppSelector((state) => state.chat);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string; date: Date }>();

  const onSubmit: SubmitHandler<{ name: string; date: Date }> = async (
    data
  ) => {
    setIsLoading(true);
    try {
      await addDoc(collection(db, "events", chatState.id, "events"), {
        name: data.name,
        date: Timestamp.fromDate(new Date(data.date)),
      });
    } catch (error: any) {
      toast.error("Could not add event: " + error.message);
    } finally {
      props.closeFn();
    }
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">
        Event name
        <input
          type="text"
          id="name"
          placeholder="Meeting"
          className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
          {...register("name", { required: "This field is required" })}
        />
        {errors.name && (
          <span className={styles.errorMsg}>{errors.name.message}</span>
        )}
      </label>
      <label htmlFor="date">
        Event date
        <input
          type="datetime-local"
          id="date"
          className={`${styles.input} ${errors.date ? styles.inputError : ""}`}
          {...register("date", { required: "This field is required" })}
        />
        {errors.date && (
          <span className={styles.errorMsg}>{errors.date.message}</span>
        )}
      </label>
      <button
        type="submit"
        className={styles.submitButton}
        disabled={isLoading}
      >
        {isLoading ? <SmallSpinner className={styles.spinner} /> : "Add"}
      </button>
    </form>
  );
};

export default AddEventModal;
