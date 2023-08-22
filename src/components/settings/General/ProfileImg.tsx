import React, { useEffect, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import ReactSlider from "react-slider";
import { toast } from "react-toastify";
import { ReactComponent as AddImg } from "../../../assets/addImage.svg";
import { ReactComponent as SmallSpinner } from "../../../assets/spinner.svg";

import styles from "./General.module.css";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { deleteProfileImg, uploadProfileImg } from "../../../redux/userActions";

const ProfileImg = () => {
  const [image, setImage] = useState<File>();
  const [imgScale, setImgScale] = useState<number>(1);
  const [imgRotation, setImgRotation] = useState<number>(0);
  const dispatch = useAppDispatch();
  const { status, avatarUrl } = useAppSelector((state) => state.user);
  const isUploading = status === "uploadingProfileImg";
  const isDeleting = status === "deletingProfileImg";
  const imgInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef(null);

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

  const handleSubmit = () => {
    if (editorRef.current) {
      //@ts-ignore
      editorRef.current.getImage().toBlob(
        (blob: Blob) => {
          dispatch(uploadProfileImg(blob));
        },
        "image/jpeg",
        1
      );
    }
  };

  useEffect(() => {
    if (status === "idle") setImage(undefined);
  }, [status, avatarUrl]);

  const handleDelete = () => {
    dispatch(deleteProfileImg());
  };

  return (
    <>
      <h4 className={styles.fieldName}>Profile image</h4>
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
          {avatarUrl && (
            <button
              className={styles.imgDeleteButton + " " + styles.changeButton}
              disabled={isDeleting}
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
          {isDeleting && <SmallSpinner className={styles.deleteSpinner} />}
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
              disabled={isUploading}
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
                disabled={isUploading}
              />
              <input
                type="number"
                min={0}
                max={360}
                value={imgRotation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setImgRotation(Number(e.target.value))
                }
                disabled={isUploading}
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
                disabled={isUploading}
              >
                Back
              </button>
              <button
                className={styles.changeButton}
                onClick={() => {
                  setImgRotation(0);
                  setImgScale(1);
                }}
                disabled={isUploading}
              >
                Reset
              </button>
            </div>
            <button
              className={styles.saveButton}
              onClick={handleSubmit}
              disabled={isUploading}
            >
              Save
            </button>
            {isUploading && <SmallSpinner className={styles.imgSpinner} />}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileImg;
