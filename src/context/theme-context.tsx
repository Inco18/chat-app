import React, { useEffect, useState } from "react";

type themeContextType = {
  theme: string;
  switchTheme: () => void;
};

export const ThemeContext = React.createContext<themeContextType>({
  theme: "",
  switchTheme: () => {},
});

const ThemeContextProvider = (props: { children?: React.ReactNode }) => {
  const [theme, setTheme] = useState("dark");

  const setDark = () => {
    document.documentElement.style.setProperty("--background", "#20232b");
    document.documentElement.style.setProperty("--accent-light", "#1a1e23");
    document.documentElement.style.setProperty("--accent-medium", "#1d1e24");
    document.documentElement.style.setProperty("--accent-dark", "#16171b");
    document.documentElement.style.setProperty("--dark", "#000000");
    document.documentElement.style.setProperty("--nav", "#f3fc8a");
    document.documentElement.style.setProperty("--accent-main", "#5852d6");
    document.documentElement.style.setProperty("--text", "#ffffff");
    document.documentElement.style.colorScheme = "dark";
    localStorage.setItem("theme", "dark");
  };

  const setLight = () => {
    document.documentElement.style.setProperty("--background", "#888888");
    document.documentElement.style.setProperty("--accent-light", "#999999");
    document.documentElement.style.setProperty("--accent-medium", "#AAAAAA");
    document.documentElement.style.setProperty("--accent-dark", "#BBBBBB");
    document.documentElement.style.setProperty("--dark", "#CCCCCC");
    document.documentElement.style.setProperty("--nav", "#f3fc8a");
    document.documentElement.style.setProperty("--accent-main", "#5852d6");
    document.documentElement.style.setProperty("--text", "#000000");
    document.documentElement.style.colorScheme = "light";
    localStorage.setItem("theme", "light");
  };

  useEffect(() => {
    const localStorageTheme = localStorage.getItem("theme");

    if (localStorageTheme && localStorageTheme === "light") {
      setLight();
      setTheme("light");
    }
  }, []);

  const switchTheme = () => {
    setTheme((prev) => {
      if (prev === "light") {
        setDark();
        return "dark";
      } else {
        setLight();
        return "light";
      }
    });
  };

  const contextValue = {
    theme: theme,
    switchTheme: switchTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
