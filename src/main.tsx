import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Import the generated route tree
import { AuthProvider } from "./users";
import { InnerApp } from "./innerApp";

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </StrictMode>
  );
}
