import { createContext, createRef } from "react";

type contextType = {
  generalRef: React.RefObject<unknown>;
  privacyRef: React.RefObject<unknown>;
};

const generalRef = createRef();
const privacyRef = createRef();
export const SettingsNavContext = createContext<contextType>({
  generalRef: generalRef,
  privacyRef: privacyRef,
});

const value: contextType = {
  generalRef: generalRef,
  privacyRef: privacyRef,
};

export const SettingsNavContextProvider = (props: {
  children: React.ReactNode;
}) => {
  return (
    <SettingsNavContext.Provider value={value}>
      {props.children}
    </SettingsNavContext.Provider>
  );
};
