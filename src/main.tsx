import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeContextProvider from "./context/theme-context";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
  </Provider>
);
