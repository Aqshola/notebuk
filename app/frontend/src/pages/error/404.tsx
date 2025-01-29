import { ReactSVG } from "react-svg";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }
  return (
    <div className="h-screen">
      <div className="mt-40 mx-auto w-fit font-comic-neue text-lg fontsem">
        Oooops, your page is
      </div>
      <div className="mx-auto w-fit mt-10">
        <ReactSVG src="/assets/images/notfound.svg" />
      </div>
      <div className="mx-auto w-fit mt-10">
        <Button styleMode="sketch" size={"lg"} onClick={handleBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
