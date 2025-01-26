import { scan } from "react-scan"; // import this BEFORE react
import React from "react";

import Landing from "./pages/Landing";
if (typeof window !== "undefined") {
  scan({
    enabled: true,
    log: true, // logs render info to console (default: false)
  });
}

function App() {
  return (
    <>
      <Landing />
    </>
  );
}

export default App;
