import React, {
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ReactComponent as Smile } from "../../../assets/smile.svg";
import { ReactComponent as Attach } from "../../../assets/attach.svg";
import { ReactComponent as Gif } from "../../../assets/gif.svg";
import { ReactComponent as Send } from "../../../assets/send.svg";
import { ReactComponent as File } from "../../../assets/file.svg";
import { ReactComponent as Remove } from "../../../assets/remove.svg";
import { ReactComponent as SmallSpinner } from "../../../assets/spinner.svg";
import ReactTextareaAutosize from "react-textarea-autosize";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import EmojiPicker, { Theme, EmojiStyle } from "emoji-picker-react";
import { EmojiClickData } from "emoji-picker-react/dist/types/exposedTypes";
import { ThemeContext } from "../../../context/theme-context";
import useOutsideClick from "../../../hooks/useOutsideClick";
import GifPicker, { TenorImage } from "gif-picker-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { sendMessage } from "../../../redux/chatActions";

import styles from "./ChatInput.module.css";

const errorClassnames = {
  enter: styles.errorEnter,
  enterActive: styles.errorEnterActive,
  exit: styles.errorExit,
  exitActive: styles.errorExitActive,
};

const emojiPickerClassnames = {
  enter: styles.emojiEnter,
  enterActive: styles.emojiEnterActive,
  exit: styles.errorExit,
  exitActive: styles.emojiExitActive,
};

const ChatInput = () => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [filesToSend, setFilesToSend] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [oldErrors, setOldErrors] = useState<string[]>([]);
  const [errorContainerVisible, setErrorContainerVisible] =
    useState<boolean>(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState<boolean>(false);
  const [gifPickerVisible, setGifPickerVisible] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerContainerRef = useRef<HTMLDivElement>(null);
  const smileImgRef = useRef<HTMLButtonElement>(null);
  const gifPickerContainerRef = useRef<HTMLDivElement>(null);
  const gifImgRef = useRef<HTMLButtonElement>(null);
  const dispatch = useAppDispatch();
  const chatState = useAppSelector((state) => state.chat);
  const isSending = chatState.status === "sendingMessage";

  const themeCtx = useContext(ThemeContext);

  useOutsideClick([emojiPickerContainerRef, smileImgRef], () =>
    setEmojiPickerVisible(false)
  );
  useOutsideClick([gifPickerContainerRef, gifImgRef], () =>
    setGifPickerVisible(false)
  );

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      if (e.dataTransfer.items) {
        if (
          [...e.dataTransfer.items].every((element) => element.kind == "file")
        ) {
          setIsDraggedOver(true);
        }
      }
    } else if (e.type === "dragleave") {
      setIsDraggedOver(false);
    }
  };

  const handleAddFile = useCallback((fileArray: File[]) => {
    const newErrorsArr: string[] = [];

    fileArray.forEach((element) => {
      if (
        errors.length === 0 ||
        !errors.some((el) => el.includes(element.name))
      ) {
        if (element.size > 1048577) {
          newErrorsArr.push(`File: ${element.name} is too big.`);
        } else if (element.size === 0) {
          newErrorsArr.push(`File: ${element.name} is empty.`);
        } else if (filesToSend.some((el) => element.name == el.name)) {
          newErrorsArr.push(`File: ${element.name} has already been added.`);
        } else {
          setFilesToSend((prev) => [...prev, element]);
        }
      }
    });

    if (newErrorsArr.length > 0) {
      setOldErrors(errors);
      setErrors((prev) => [...prev, ...newErrorsArr]);
    }
  }, []);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggedOver(false);

    if (e.dataTransfer.files) {
      handleAddFile([...e.dataTransfer.files]);
    }
  };

  const handleFileClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const filesArr = Array.from(e.target.files);
    if (filesArr) {
      handleAddFile(filesArr);
    }
  };

  useEffect(() => {
    let timeout: any;
    setErrorContainerVisible(true);

    errors.forEach((element) => {
      if (!oldErrors.includes(element)) {
        setTimeout(() => {
          setErrors((prev) => {
            return prev.filter((el) => el != element);
          });
        }, 5000);
      }
    });

    if (errors.length == 0) {
      timeout = setTimeout(() => {
        setErrorContainerVisible(false);
      }, 500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [errors]);

  const handleFileRemove = (e: SyntheticEvent<SVGElement>) => {
    if (e.target instanceof SVGElement) {
      const nameToRemove = e.target.closest(`div`)?.id;
      setFilesToSend((prev) =>
        prev.filter((element) => element.name !== nameToRemove)
      );
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    if (inputRef.current) {
      inputRef.current.value += emojiData.emoji;
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if ((!inputRef.current?.value && filesToSend.length === 0) || isSending)
      return;
    dispatch(
      sendMessage({
        text: inputRef.current?.value,
        files: filesToSend,
        gifUrl: "",
      })
    ).then(() => {
      inputRef.current ? (inputRef.current.value = "") : "";
      setFilesToSend([]);
    });
  };

  const handleGifClick = (tenorImage: TenorImage) => {
    dispatch(sendMessage({ text: "", files: [], gifUrl: tenorImage.url })).then(
      () => setGifPickerVisible(false)
    );
  };

  return (
    <div className={styles.inputContainer} onDragEnter={handleDrag}>
      <CSSTransition
        in={errorContainerVisible}
        timeout={500}
        unmountOnExit
        classNames={errorClassnames}
      >
        <div className={styles.errorsContainer}>
          <TransitionGroup component={null}>
            {errors.map((element) => {
              return (
                <CSSTransition
                  timeout={500}
                  classNames={errorClassnames}
                  key={element}
                  unmountOnExit
                >
                  <div className={styles.error}>{element}</div>
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        </div>
      </CSSTransition>

      {filesToSend.length > 0 && (
        <div className={styles.filesPreviewContainer}>
          {filesToSend.map((element: File) => {
            if (element.type.includes("image")) {
              return (
                <div
                  className={styles.fileImgElement}
                  key={element.name}
                  id={element.name}
                >
                  <img
                    src={URL.createObjectURL(element)}
                    onLoad={(e: SyntheticEvent<HTMLImageElement>) => {
                      if (e.target instanceof HTMLImageElement) {
                        URL.revokeObjectURL(e.target.src);
                      }
                    }}
                  />
                  <Remove
                    className={styles.removeImg}
                    onClick={handleFileRemove}
                  />
                </div>
              );
            } else {
              return (
                <div
                  className={styles.fileElement}
                  key={element.name}
                  id={element.name}
                >
                  <File className={styles.fileImg} />
                  <div className={styles.fileElementText}>{element.name}</div>
                  <Remove
                    className={styles.removeImg}
                    onClick={handleFileRemove}
                  />
                </div>
              );
            }
          })}
        </div>
      )}
      {isDraggedOver && (
        <div
          className={styles.dropDiv}
          onDragLeave={handleDrag}
          onDragOver={(e: React.DragEvent<HTMLDivElement>) =>
            e.preventDefault()
          }
          onDrop={handleFileDrop}
        >
          Drop files here (max size: 1MB)
        </div>
      )}
      <CSSTransition
        in={emojiPickerVisible}
        timeout={300}
        unmountOnExit
        classNames={emojiPickerClassnames}
      >
        <div
          className={styles.emojiPickerContainer}
          ref={emojiPickerContainerRef}
        >
          <EmojiPicker
            theme={themeCtx.theme === "dark" ? Theme.DARK : Theme.LIGHT}
            autoFocusSearch={false}
            lazyLoadEmojis={true}
            emojiStyle={EmojiStyle.NATIVE}
            skinTonesDisabled
            onEmojiClick={handleEmojiClick}
          />
        </div>
      </CSSTransition>
      <CSSTransition
        in={gifPickerVisible}
        timeout={300}
        unmountOnExit
        classNames={emojiPickerClassnames}
      >
        <div
          className={styles.emojiPickerContainer}
          ref={gifPickerContainerRef}
        >
          <GifPicker
            tenorApiKey={import.meta.env.VITE_TENOR_KEY}
            clientKey="Chat App"
            theme={themeCtx.theme === "dark" ? Theme.DARK : Theme.LIGHT}
            autoFocusSearch={false}
            onGifClick={handleGifClick}
          />
        </div>
      </CSSTransition>
      <div className={styles.mainContainer}>
        <ReactTextareaAutosize
          className={styles.textInput}
          placeholder="Write your message here"
          ref={inputRef}
          maxRows={4}
          onKeyDown={handleInputKeyDown}
        ></ReactTextareaAutosize>
        <input
          type="file"
          accept=""
          ref={fileInputRef}
          hidden
          multiple
          onChange={handleFileClick}
        />

        <div className={styles.imagesContainer}>
          <button
            className={styles.inputImg}
            ref={smileImgRef}
            onClick={() => setEmojiPickerVisible((prev) => !prev)}
          >
            <Smile className={styles.inputImg} />
          </button>
          <button className={styles.inputImg}>
            <Attach
              className={styles.inputImg}
              onClick={() => fileInputRef.current?.click()}
            />
          </button>
          <button
            className={styles.inputImg}
            ref={gifImgRef}
            onClick={() => setGifPickerVisible((prev) => !prev)}
          >
            <Gif className={styles.inputImg} />
          </button>
          <button
            className={styles.sendContainer}
            onClick={handleSubmit}
            disabled={isSending}
          >
            {isSending ? (
              <SmallSpinner
                className={styles.inputImg}
                style={{ color: "black", padding: ".2rem" }}
              />
            ) : (
              <Send className={styles.inputImg} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
