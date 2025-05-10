import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import NotFound from "../pages/error/404";
import SignUp from "../pages/auth/SignUp";
import TransitionComponent from "../components/custom/Transition";
import VerifyOTP from "@/pages/auth/VerifyOTP";
import General from "@/pages/note/General";

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
    path: "/verify-otp",
    element: (
      <TransitionComponent>
        <VerifyOTP />
      </TransitionComponent>
    ),
  },

  {
    path: "/note",
    element: (
      <TransitionComponent>
        <General />
      </TransitionComponent>
    ),
  },

  {
    path: "*",
    element: (
      <TransitionComponent>
        <NotFound />
      </TransitionComponent>
    ),
  },
]);

export default router;
