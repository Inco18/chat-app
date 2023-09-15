import React, { ForwardedRef, useReducer, useState } from "react";
import { ReactComponent as Pictures } from "../../../assets/pictures.svg";
import { ReactComponent as File } from "../../../assets/file.svg";
import { CSSTransition } from "react-transition-group";
import AnimateHeight from "react-animate-height";
import Attachments from "./Attachments";
import TopContainer from "./Sidebar/TopContainer";
import EventsList from "./Sidebar/EventsList";
import Other from "./Sidebar/Other";
import Customize from "./Sidebar/Customize";
import OptionHeader from "./Sidebar/OptionHeader";

import styles from "./ChatSidebar.module.css";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../../hooks/reduxHooks";

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
  (props: { className: string }, ref: ForwardedRef<HTMLDivElement>) => {
    const [state, dispatch] = useReducer(reducer, {
      attachmentsVisible: false,
      attachmentsContainerVisible: false,
      initialAttachments: "photos",
    });
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const { pathname } = useLocation();
    const chatState = useAppSelector((state) => state.chat);

    return (
      <div className={props.className} ref={ref}>
        <div className={styles.innerContainer}>
          <TopContainer />
          <div className={styles.optionsContainer}>
            {!pathname.includes("archived") &&
              !pathname.includes("blocked") &&
              !pathname.includes("trash") && <Customize />}

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

            {!pathname.includes("trash") && <Other />}
            <EventsList />
          </div>
        </div>

        <CSSTransition
          in={state.attachmentsContainerVisible}
          timeout={300}
          classNames={{
            enter: styles.attachmentsEnter,
            enterActive: styles.attachmentsEnterActive,
            exit: styles.attachmentsExit,
            exitActive: styles.attachmentsExitActive,
          }}
          onEntered={() => setIsLoaded(true)}
          onExited={() => setIsLoaded(false)}
          unmountOnExit
        >
          <Attachments
            isLoaded={isLoaded}
            state={state}
            closeFunction={() =>
              dispatch({ type: "attachmentsContainerVisible" })
            }
          />
        </CSSTransition>
      </div>
    );
  }
);

export default ChatSidebar;
