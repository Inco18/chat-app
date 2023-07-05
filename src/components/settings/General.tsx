import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import ReactSlider from "react-slider";
import { ReactComponent as Check } from "../../assets/check.svg";
import { ReactComponent as AddImg } from "../../assets/addImage.svg";

import styles from "./General.module.css";

const General = () => {
  const [inputOnField, setInputOnField] = useState<number>();
  const [image, setImage] = useState<File>();
  const [imgScale, setImgScale] = useState<number>(1);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const handleImgDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.dataTransfer.files[0]);
    if (
      e.dataTransfer.files[0] &&
      e.dataTransfer.files[0].type.includes("image")
    ) {
      setImage(e.dataTransfer.files[0]);
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
          />
        </div>
      ) : (
        <div className={styles.imageEditorContainer}>
          <AvatarEditor
            image={image}
            color={[22, 23, 27, 0.5]}
            scale={imgScale}
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
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default General;
