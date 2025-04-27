import router from "@/routes/route";
import { RouterProvider } from "react-router-dom";

export default function RouterWrapper() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
