import { Tally3Icon } from "lucide-react";

import Button from "../atomic/Button";
import MediumDrawer from "../../components/MediumDrawer";
import { useState } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";

export default function LandingNav() {
  const [showDrawerMobileNav, setShowDrawerMobileNav] = useState(false);

  function handleToggleDrawerMobileNav() {
    setShowDrawerMobileNav(!showDrawerMobileNav);
  }

  return (
    <>
      <nav className="grid grid-cols-6 md:grid-cols-12 mx-9 my-4 gap-x-11 items-center ">
        <div className="col-span-2 items-center">
          <Link to={"/"}>
            <h1 className="font-comic-neue font-bold text-primary-purple text-lg">
              Notebuk
            </h1>
          </Link>
        </div>

        <div className="col-span-2 md:hidden col-start-5 flex justify-end items-center">
          <button
            onClick={handleToggleDrawerMobileNav}
            className={clsx(
              "transition-transform",
              showDrawerMobileNav && "rotate-0",
              !showDrawerMobileNav && "-rotate-90"
            )}
          >
            <Tally3Icon className="w-7 h-7" />
          </button>
        </div>
        {/* FOR MOBILE */}

        <div className="col-span-6 md:hidden flex-col flex justify-start mt-4 ">
          <MediumDrawer className="w-full" display={showDrawerMobileNav}>
            <div className="w-full flex flex-col">
              <Button variant={"ghost"} styleMode="sketch">
                About
              </Button>
              <Button variant={"ghost"} styleMode="sketch">
                Help
              </Button>
              <Button
                elevation={0}
                variant={"outline-primary"}
                size={"sm"}
                styleMode="sketch"
              >
                Login
              </Button>
            </div>
          </MediumDrawer>
        </div>

        {/* FOR MEDIUM */}
        <div className="md:col-span-2 md:col-start-11 h-0 md:h-auto invisible md:visible md:flex justify-between items-center">
          <Button variant={"ghost"} styleMode="sketch">
            About
          </Button>
          <Button variant={"ghost"} styleMode="sketch">
            Help
          </Button>
          <Button
            elevation={0}
            variant={"outline-primary"}
            size={"sm"}
            styleMode="sketch"
          >
            Login
          </Button>
        </div>
      </nav>
    </>
  );
}
