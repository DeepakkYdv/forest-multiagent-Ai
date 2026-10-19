import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import QueryProvider from "./app/providers/QueryProvider";
import App from "./App";
import "./index.css";
import { store } from "../redux/store/store";
import { Provider } from 'react-redux'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryProvider>
        <App />
        <Toaster position="top-right" />
      </QueryProvider>
    </Provider> 
  </StrictMode>
);
