import { Bars3Icon } from "@heroicons/react/24/outline";
import Button from "../components/Button";
import MediumDrawer from "../components/MediumDrawer";
import { useState } from "react";
import clsx from "clsx";

export default function Landing() {
  const [showDrawerMobileNav, setShowDrawerMobileNav] = useState(false);

  function handleToggleDrawerMobileNav() {
    setShowDrawerMobileNav(!showDrawerMobileNav);
  }

  return (
    <div className="max-w-screen-2xl mx-auto min-h-screen border">
      <nav className="grid grid-cols-6 md:grid-cols-12 mx-9 my-4 gap-x-11 items-center ">
        <div className="col-span-2 items-center">
          <h1 className="font-comic-neue font-bold text-primary-purple text-lg">
            Notebuk
          </h1>
        </div>

        <div className="col-span-2 md:hidden col-start-5 flex justify-end items-center">
          <button
            onClick={handleToggleDrawerMobileNav}
            className={clsx(
              "transition-transform",
              showDrawerMobileNav && "rotate-90",
              !showDrawerMobileNav && "rotate-0"
            )}
          >
            <Bars3Icon className="w-7 h-7" />
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
      <main>
        <div className="mt-28 flex flex-col gap-6">
          <h1 className="text-5xl md:text-8xl font-comic-neue font-medium text-primary-purple text-center">
            Notebuk
          </h1>
          <p className="font-comic-neue text-sm md:text-xl text-center">
            Capture ideas <span className="font-bold">anytime, anywhere</span>{" "}
            by writing, drawing, and <br /> syncing notes seamlessly across all
            your devices
          </p>
          <div className="flex justify-center gap-3 md:gap-x-9 items-center">
            <Button variant={"third"} styleMode="sketch" size={"lg"}>
              Join
            </Button>
            <span className="font-comic-neue">Or</span>
            <Button variant={"outline-black"} styleMode="sketch" size={"lg"}>
              Write
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
