import React, { ForwardedRef, useReducer } from "react";
import { ReactComponent as Pictures } from "../../../assets/pictures.svg";
import { ReactComponent as File } from "../../../assets/file.svg";

import styles from "./ChatSidebar.module.css";
import AnimateHeight from "react-animate-height";
import Attachments from "./Attachments";
import TopContainer from "./Sidebar/TopContainer";
import EventsList from "./Sidebar/EventsList";
import Other from "./Sidebar/Other";
import Customize from "./Sidebar/Customize";
import OptionHeader from "./Sidebar/OptionHeader";

export type stateType = {
  attachmentsVisible: boolean;
  attachmentsContainerVisible: boolean;
  initialAttachments: "photos" | "files" | undefined;
};

type actionType = {
  type: "attachmentsVisible" | "attachmentsContainerVisible";
  initial?: "photos" | "files" | undefined;
};

const reducer = (state: stateType, action: actionType): stateType => {
  if (action.type === "attachmentsVisible") {
    return {
      ...state,
      attachmentsVisible: !state.attachmentsVisible,
    };
  }

  if (action.type === "attachmentsContainerVisible") {
    return {
      ...state,
      attachmentsContainerVisible: !state.attachmentsContainerVisible,
      initialAttachments: action.initial ? action.initial : undefined,
    };
  }
  throw Error("Unknown action");
};

const ChatSidebar = React.forwardRef(
  (
    props: { className: string; toggleSearchInput: () => void },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const [state, dispatch] = useReducer(reducer, {
      attachmentsVisible: false,
      attachmentsContainerVisible: false,
      initialAttachments: "photos",
    });

    return (
      <div className={props.className} ref={ref}>
        <div className={styles.innerContainer}>
          <TopContainer toggleSearchInput={props.toggleSearchInput} />
          <div className={styles.optionsContainer}>
            <Customize />

            <OptionHeader
              onClick={() => {
                dispatch({ type: "attachmentsVisible" });
              }}
              isOpen={state.attachmentsVisible}
              title={"Attachments"}
            />
            <AnimateHeight
              duration={300}
              height={state.attachmentsVisible ? "auto" : 0}
            >
              <div className={styles.optionsInnerContainer}>
                <div
                  className={styles.option}
                  onClick={() =>
                    dispatch({
                      type: "attachmentsContainerVisible",
                      initial: "photos",
                    })
                  }
                >
                  <Pictures className={styles.optionImg} />
                  <p className={styles.optionText}>Photos</p>
                </div>
                <div
                  className={styles.option}
                  onClick={() =>
                    dispatch({
                      type: "attachmentsContainerVisible",
                      initial: "files",
                    })
                  }
                >
                  <File className={styles.optionImg} />
                  <p className={styles.optionText}>Files</p>
                </div>
              </div>
            </AnimateHeight>

            <Other />
            <EventsList />
          </div>
        </div>

        <Attachments
          state={state}
          closeFunction={() =>
            dispatch({ type: "attachmentsContainerVisible" })
          }
        />
      </div>
    );
  }
);

export default ChatSidebar;
