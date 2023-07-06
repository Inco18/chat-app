import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import ReactSlider from "react-slider";
import { toast } from "react-toastify";
import { ReactComponent as Check } from "../../assets/check.svg";
import { ReactComponent as Remove } from "../../assets/remove.svg";
import { ReactComponent as AddImg } from "../../assets/addImage.svg";

import styles from "./General.module.css";

const General = () => {
  const [inputOnField, setInputOnField] = useState<number>();
  const [image, setImage] = useState<File>();
  const [imgScale, setImgScale] = useState<number>(1);
  const [imgRotation, setImgRotation] = useState<number>(0);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const handleImgDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      e.dataTransfer.files[0] &&
      e.dataTransfer.files[0].type.includes("image")
    ) {
      setImage(e.dataTransfer.files[0]);
    } else {
      toast.error("This is not a valid file.");
    }
  };

  const handleImgClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0].type.includes("image")) {
      setImage(e.target.files[0]);
    } else {
      toast.error("This is not a valid file.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      (
        (e.target as HTMLElement).closest(`.${styles.form}`)
          ?.children[0] as HTMLInputElement
      ).value
    );
    setInputOnField(undefined);
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.fieldName}>First name</h4>
      {inputOnField != 0 ? (
        <>
          <p className={styles.fieldValue}>Jan</p>
          <button
            className={styles.changeButton}
            onClick={() => setInputOnField(0)}
          >
            Change
          </button>
        </>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={"Jan"}
            className={styles.input}
            autoFocus
          />
          <Check className={`${styles.checkImg}`} onClick={handleSubmit} />
          <Remove
            className={`${styles.checkImg}`}
            onClick={() => setInputOnField(undefined)}
          />
        </form>
      )}

      <h4 className={styles.fieldName}>Last name</h4>
      {inputOnField != 1 ? (
        <>
          <p className={styles.fieldValue}>Kowalski</p>
          <button
            className={styles.changeButton}
            onClick={() => setInputOnField(1)}
          >
            Change
          </button>
        </>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={"Kowalski"}
            className={styles.input}
            autoFocus
          />
          <Check className={`${styles.checkImg}`} onClick={handleSubmit} />
          <Remove
            className={`${styles.checkImg}`}
            onClick={() => setInputOnField(undefined)}
          />
        </form>
      )}
      <h4 className={styles.fieldName}>E-mail</h4>
      {inputOnField != 2 ? (
        <>
          <p className={styles.fieldValue}>j.kowalski@gmail.com</p>
          <button
            className={styles.changeButton}
            onClick={() => setInputOnField(2)}
          >
            Change
          </button>
        </>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={"j.kowalski@gmail.com"}
            className={styles.input}
            autoFocus
          />
          <Check className={`${styles.checkImg}`} onClick={handleSubmit} />
          <Remove
            className={`${styles.checkImg}`}
            onClick={() => setInputOnField(undefined)}
          />
        </form>
      )}
      <h4 className={styles.fieldName}>Profile image</h4>
      {!image ? (
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
      ) : (
        <div className={styles.imageEditorContainer}>
          <AvatarEditor
            image={image}
            color={[22, 23, 27, 0.5]}
            scale={imgScale}
            rotate={imgRotation}
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
              >
                Back
              </button>
              <button
                className={styles.changeButton}
                onClick={() => {
                  setImgRotation(0);
                  setImgScale(1);
                }}
              >
                Reset
              </button>
            </div>
            <button className={styles.saveButton}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default General;
