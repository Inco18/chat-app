import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import AnimateHeight from "react-animate-height";
import { ReactComponent as Star } from "../../../../assets/star.svg";
import { ReactComponent as Bell } from "../../../../assets/bell.svg";
import { ReactComponent as Blocked } from "../../../../assets/blocked.svg";
import { ReactComponent as Trash } from "../../../../assets/trash.svg";
import OptionHeader from "./OptionHeader";

import styles from "./Other.module.css";

const Other = () => {
  const [otherVisible, setOtherVisible] = useState<boolean>(false);
  const { pathname } = useLocation();

  return (
    <>
      <OptionHeader
        isOpen={otherVisible}
        title={"Other"}
        onClick={() => setOtherVisible((prev) => !prev)}
      />
      <AnimateHeight duration={300} height={otherVisible ? "auto" : 0}>
        <div className={styles.optionsInnerContainer}>
          {!pathname.includes("archived") && !pathname.includes("blocked") && (
            <>
              <div className={styles.option}>
                <Star className={styles.optionImg} />
                <p className={styles.optionText}>Add to favourites</p>
              </div>
              <div className={styles.option}>
                <Bell className={styles.optionImg} />
                <p className={styles.optionText}>Mute</p>
              </div>
              <div className={styles.option}>
                <Blocked className={styles.optionImg} />
                <p className={styles.optionText}>Block</p>
              </div>
            </>
          )}
          <div className={styles.option}>
            <Trash className={styles.optionImg} />
            <p className={styles.optionText}>Delete</p>
          </div>
        </div>
      </AnimateHeight>
    </>
  );
};

export default Other;
