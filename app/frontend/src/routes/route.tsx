import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import NotFound from "../pages/error/404";
import SignUp from "../pages/auth/SignUp";
import TransitionComponent from "../components/custom/Transition";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <TransitionComponent>
        <Landing />
      </TransitionComponent>
    ),
  },

  {
    path: "/sign-up",
    element: (
      <TransitionComponent>
        <SignUp />
      </TransitionComponent>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
