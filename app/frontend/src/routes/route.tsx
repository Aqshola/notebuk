import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import NotFound from "../pages/error/404";
import SignUp from "../pages/auth/SignUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
