import { useState } from "react";
import { Link } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebase";
import { toast } from "react-toastify";

import styles from "./Form.module.css";

const ForgotForm = () => {
  const [isSending, setIsSending] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>();

  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    setIsSending(true);
    try {
      await sendPasswordResetEmail(auth, data.email, {
        url: "http://localhost:5173/signin",
      });
      toast.success("Password reset email has been sent");
    } catch (error: any) {
      console.log();
      toast.error("Password reset email could not be sent: " + error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.title}>Send a password reset e-mail</h2>
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
      <button
        type="submit"
        className={styles.signUpButton}
        disabled={isSending}
      >
        {isSending ? (
          <span className={styles.loadingButtonText}>Sending</span>
        ) : (
          "Send"
        )}
      </button>
      <Link to={"/signin"} className={styles.link}>
        Go back to sign in page.
      </Link>
      <Link to={"/signup"} className={styles.link}>
        Go to sign up page.
      </Link>
    </form>
  );
};

export default ForgotForm;
