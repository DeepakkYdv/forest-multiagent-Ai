import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import QueryProvider from "./app/providers/QueryProvider";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryProvider>
      <App />
      <Toaster position="top-right" />
    </QueryProvider>
  </StrictMode>
);
