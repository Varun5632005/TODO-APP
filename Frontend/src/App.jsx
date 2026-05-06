import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Login from "./components/Login";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  const browserRouterObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index:true,
          element:<Login />
        },
        {
          path:"login",
          element:<Login />
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "user-profile",
          element: <UserProfile />,
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "reset-password/:token",
          element: <ResetPassword />,
        },
      ],
    },
  ]);
  return <RouterProvider router={browserRouterObj} />;
}

export default App;
