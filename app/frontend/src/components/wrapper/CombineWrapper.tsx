import RouterWrapper from "./RouterWrapper";
import TanQueryWrapper from "./TanQueryWrapper";
import { scan } from "react-scan";
export default function CombineWrapper() {
  scan({
    enabled: true,
    log: true, // logs render info to console (default: false)
  });
  return (
    <>
      <TanQueryWrapper>
        <RouterWrapper />
      </TanQueryWrapper>
    </>
  );
}
