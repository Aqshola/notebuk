import { Link } from "react-router-dom";
import Button from "../../components/Button";
import LandingNav from "../../components/compound/LandingNav";
import Input from "../../components/atomic/Input";

export default function SignUp() {
  return (
    <div className="max-w-screen-2xl h-screen mx-auto">
      <LandingNav />
      <div className="mt-24 flex flex-col items-center">
        <h1 className="text-3xl text-primary-purple font-comic-neue font-semibold">
          Let's join us
        </h1>
        <div className="flex flex-col   p-10 gap-y-4">
          <img
            src="/assets/images/asking-form.png"
            alt="person asking a form"
            className="w-64 object-cover"
          />
          <div className="w-64 gap-y-2 flex flex-col">
            <Input type="email" placeholder="Input email" className="w-full" />
            <Input type="password" placeholder="Input password" />
          </div>
          <Button styleMode="sketch" size={"lg"} className="w-fit mx-auto">
            Sign Up
          </Button>
          <span className="text-xs font-comic-neue text-center">
            Already have an account?{" "}
            <Link to={"/sign-in"}>
              <span className="text-primary-purple">Sign In</span>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
