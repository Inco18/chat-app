import React, { useEffect, useRef, useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ReactComponent as AddImg } from "../../assets/addImage.svg";
import { ReactComponent as SmallSpinner } from "../../assets/spinner.svg";
import AvatarEditor from "react-avatar-editor";
import ReactSlider from "react-slider";

import styles from "./GroupChatModal.module.css";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../services/firebase";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { createGroupChat } from "../../redux/chatActions";

const GroupChatModal = () => {
  const [image, setImage] = useState<File>();
  const [imgScale, setImgScale] = useState<number>(1);
  const [imgRotation, setImgRotation] = useState<number>(0);
  const [usersSearch, setUsersSearch] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersResults, setUserResults] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ title: string }>({
    defaultValues: { title: "" },
  });
  const dispatch = useAppDispatch();
  const chatState = useAppSelector((state) => state.chat);
  const isCreating = chatState.status === "creatingGroupChat";

  const handleImgDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      e.dataTransfer.files[0] &&
      e.dataTransfer.files[0].type.includes("image")
    ) {
      setImage(e.dataTransfer.files[0]);
    } else {
      toast.error("This is not a valid image.");
    }
  };

  const handleImgClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0].type.includes("image")) {
      setImage(e.target.files[0]);
    } else {
      toast.error("This is not a valid image.");
    }
  };

  const onSubmit: SubmitHandler<{ title: string }> = (data) => {
    console.log(data);
    console.log(usersList);
    if (usersList.length < 1) {
      toast.error("You need to add at least 1 person to this chat");
      return;
    }
    if (editorRef.current) {
      //@ts-ignore
      editorRef.current.getImage().toBlob(
        (blob: Blob) => {
          dispatch(
            createGroupChat({
              title: data.title,
              users: usersList,
              imgBlob: blob,
            })
          );
        },
        "image/jpeg",
        1
      );
    } else {
      dispatch(
        createGroupChat({
          title: data.title,
          users: usersList,
        })
      );
    }
  };

  useEffect(() => {
    if (!usersSearch) setUserResults([]);
    const timeout = setTimeout(async () => {
      if (!usersSearch) return;
      const queryUsers = query(
        collection(db, "users"),
        where("fullName", ">=", usersSearch.toLowerCase()),
        where("fullName", "<=", usersSearch.toLowerCase() + "\uf8ff")
      );
      setIsLoadingUsers(true);
      const querySnapshot = await getDocs(queryUsers);
      const arr = querySnapshot.docs
        .filter((userDocSnap: any) => {
          const userData = userDocSnap.data();
          return (
            userDocSnap.id !== auth.currentUser?.uid &&
            userData.allowText &&
            !usersList.some((user) => {
              return user.id === userDocSnap.id;
            })
          );
        })
        .map((userDocSnap: any) => {
          const userData = userDocSnap.data();
          return {
            id: userDocSnap.id,
            ...userData,
          };
        });
      setUserResults(arr);
      setIsLoadingUsers(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [usersSearch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <label className={styles.label}>
        Chat title:
        <input
          className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
          type="text"
          {...register("title", { required: "This field is required" })}
        />
        {errors.title && (
          <span className={styles.errorMsg}>{errors.title.message}</span>
        )}
      </label>
      <label>
        Chat image:
        <input type="file" ref={imgInputRef} hidden />
      </label>
      {!image ? (
        <>
          <div
            className={styles.imgDropField}
            onClick={() => imgInputRef.current?.click()}
            onDrop={handleImgDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <AddImg className={styles.addImg} />
            <p>Choose a photo or drop it here.</p>
            <input
              type="file"
              hidden
              ref={imgInputRef}
              accept="image/png, image/jpeg"
              onChange={handleImgClick}
            />
          </div>
        </>
      ) : (
        <div className={styles.imageEditorContainer}>
          <AvatarEditor
            ref={editorRef}
            image={image}
            color={[22, 23, 27, 0.5]}
            scale={imgScale}
            rotate={imgRotation}
            borderRadius={100}
          />
          <div className={styles.imgSettings}>
            <label id="scaleSlider" className={styles.sliderLabel}>
              Zoom
            </label>
            <ReactSlider
              min={1}
              max={4}
              step={0.01}
              className={styles.slider}
              renderTrack={(props, state) => (
                <div
                  {...props}
                  className={`${styles.sliderTrack} ${
                    state.index == 0
                      ? styles.sliderTrack_0
                      : styles.sliderTrack_1
                  }`}
                />
              )}
              thumbClassName={styles.sliderThumb}
              onChange={(value) => setImgScale(value)}
              ariaLabelledby="scaleSlider"
              value={imgScale}
            />
            <label id="rotationSlider" className={styles.sliderLabel}>
              Rotate
            </label>
            <div className={styles.rotationContainer}>
              <ReactSlider
                min={0}
                max={360}
                step={1}
                className={styles.slider}
                renderTrack={(props, state) => (
                  <div
                    {...props}
                    className={`${styles.sliderTrack} ${
                      state.index == 0
                        ? styles.sliderTrack_0
                        : styles.sliderTrack_1
                    }`}
                  />
                )}
                thumbClassName={styles.sliderThumb}
                onChange={(value) => setImgRotation(value)}
                value={imgRotation}
                ariaLabelledby="rotationSlider"
              />
              <input
                type="number"
                min={0}
                max={360}
                value={imgRotation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setImgRotation(Number(e.target.value))
                }
              />
              <span>°</span>
            </div>
            <div className={styles.buttonsContainer}>
              <button
                className={styles.changeButton}
                onClick={() => {
                  setImage(undefined);
                  setImgRotation(0);
                  setImgScale(1);
                }}
                type="button"
              >
                Back
              </button>
              <button
                className={styles.changeButton}
                onClick={() => {
                  setImgRotation(0);
                  setImgScale(1);
                }}
                type="button"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={styles.usersContainer}>
        <label>
          Users:
          <input
            type="text"
            className={styles.input}
            onChange={(e) => setUsersSearch(e.target.value)}
          />
        </label>
        <div className={styles.searchResults}>
          {isLoadingUsers && (
            <div className={styles.smallSpinner}>
              <SmallSpinner />
            </div>
          )}
          {usersResults.map((user) => {
            return (
              <div
                className={styles.resultUser}
                key={user.id}
                onClick={() =>
                  setUsersList((prev) =>
                    prev.some((prevUser) => prevUser.id === user.id)
                      ? prev
                      : [...prev, user]
                  )
                }
              >
                <img
                  src={
                    user.avatarUrl
                      ? user.avatarUrl
                      : user.sex === "female"
                      ? "/defaultFemale.webp"
                      : "/defaultMale.webp"
                  }
                  className={styles.img}
                />
                <p>
                  {user.firstName} {user.lastName}
                </p>
              </div>
            );
          })}
        </div>
        <div className={styles.usersList}>
          Added users:
          {usersList.map((user) => {
            return (
              <div
                className={styles.resultUser}
                key={user.id}
                onClick={() =>
                  setUsersList((prev) =>
                    prev.filter((prevUser) => prevUser.id !== user.id)
                  )
                }
              >
                <img
                  src={
                    user.avatarUrl
                      ? user.avatarUrl
                      : user.sex === "female"
                      ? "/defaultFemale.webp"
                      : "/defaultMale.webp"
                  }
                  className={styles.img}
                />
                <p>
                  {user.firstName} {user.lastName}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <button
        type="submit"
        className={styles.submitButton}
        disabled={isCreating}
      >
        {isCreating ? (
          <span className={styles.loadingButtonText}>Creating</span>
        ) : (
          "Create"
        )}
      </button>
    </form>
  );
};

export default GroupChatModal;
