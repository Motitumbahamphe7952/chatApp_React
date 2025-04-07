import { createBrowserRouter } from "react-router-dom";
import MessagePage from "../components/MessagePage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import Authlayouts from "../layout/layout.jsx";
import LoginPage from "../pages/LoginPage.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "register",
        element:<Authlayouts><RegisterPage /></Authlayouts>
      },
      {
        path: "email",
        element: <Authlayouts><CheckEmailPage /></Authlayouts>
      },
      {
        path: "password",
        element: <Authlayouts><CheckPasswordPage /></Authlayouts>
      },
      {
        path: "login",
        element: <Authlayouts><LoginPage /></Authlayouts>
      },
      {
        path: "",
        element: <Home />,
        children: [
          {
            path: ':userId',
            element: <MessagePage />,
          },
        ],
      },
    ],
  },
]);

export default router;
