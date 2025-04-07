import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </StrictMode>
);

/* 
Use RouterProvider if:

You’re building a large application with complex routing needs.
You want to leverage advanced features like data loading, route-based code splitting, or built-in error handling.
You’re using React Router v6.4 or later.

Use BrowserRouter if:

You’re building a smaller application with straightforward routing needs.
You’re using an older version of React Router (pre-v6.4).
You prefer to define routes directly inside your components.
*/
