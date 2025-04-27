import { ReactSVG } from "react-svg";
import Button from "../../components/atomic/Button";
import { useNavigate } from "react-router-dom";
import NotFoundSpin from "../../components/custom/NotFoundSpin";

export default function NotFound() {
  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }
  return (
    <div className="h-screen">
      <div className="mt-28 mx-auto w-fit font-comic-neue text-lg fontsem">
        Oooops, your page is
      </div>
      <div className="mx-auto w-fit mt-10">
        <NotFoundSpin />
      </div>
      <div className="mx-auto w-fit mt-10">
        <Button styleMode="sketch" size={"lg"} onClick={handleBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
