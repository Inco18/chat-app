import { useContext, useEffect } from "react";

import styles from "./BlocksList.module.css";
import SettingsBlock from "./SettingsBlock";
import General from "./General";
import Privacy from "./Privacy";
import { useLocation, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { SettingsNavContext } from "../../context/settingsNavContext";

const BlocksList = () => {
  const settingsRefs = useContext(SettingsNavContext);
  const [generalRefView, inViewGeneral] = useInView({ threshold: 0.4 });
  const [privacyRefView, inViewPrivacy] = useInView();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (inViewGeneral) {
      navigate("general", { replace: true });
    } else if (!inViewGeneral && inViewPrivacy) {
      navigate("privacy", { replace: true });
    }
  }, [inViewGeneral]);

  useEffect(() => {
    if (location.pathname.includes("privacy"))
      (settingsRefs.privacyRef.current as HTMLDivElement).scrollIntoView();
  }, []);

  return (
    <main className={styles.container}>
      <SettingsBlock
        title="General account settings"
        ref={(el: HTMLDivElement) => {
          // @ts-ignore
          settingsRefs.generalRef.current = el;
          // @ts-ignore
          generalRefView(el);
        }}
      >
        <General />
      </SettingsBlock>
      <SettingsBlock
        title="Privacy settings"
        ref={(el: HTMLDivElement) => {
          // @ts-ignore
          settingsRefs.privacyRef.current = el;
          // @ts-ignore
          privacyRefView(el);
        }}
      >
        <Privacy />
      </SettingsBlock>
    </main>
  );
};

export default BlocksList;
