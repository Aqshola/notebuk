import { Bars3Icon } from "@heroicons/react/24/outline";
import Button from "../components/Button";
import MediumDrawer from "../components/MediumDrawer";
import { useState } from "react";
import clsx from "clsx";
import { RoughNotation } from "react-rough-notation";
import { ReactSVG } from "react-svg";
import Box from "../components/Box";
import { Helmet } from "react-helmet";

export default function Landing() {
  const [showDrawerMobileNav, setShowDrawerMobileNav] = useState(false);

  function handleToggleDrawerMobileNav() {
    setShowDrawerMobileNav(!showDrawerMobileNav);
  }

  return (
    <>
      <Helmet>
        <title>Notebuk</title>
      </Helmet>

      <div className="max-w-screen-2xl mx-auto  h-screen flex flex-col">
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
            <MediumDrawer
              className="w-full"
              display={showDrawerMobileNav}
              elevation={3}
            >
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
        <main className="flex-1 flex flex-col">
          <div className="mt-28 flex flex-col gap-6">
            <div className="relative flex  mx-auto  w-fit">
              <ReactSVG
                src="assets/images/new.svg"
                className="absolute -top-16 left-0"
              />

              <ReactSVG
                src="assets/images/bulb-off.svg"
                className="absolute -top-10 -right-16"
              />
              <h1 className="text-5xl md:text-8xl font-comic-neue font-semibold text-primary-purple text-center">
                Notebuk
              </h1>
            </div>
            <p className="font-comic-neue text-sm md:text-xl text-center">
              Capture ideas{" "}
              <span className="font-bold relative">
                <RoughNotation type="underline" show padding={0}>
                  anytime, anywhere
                </RoughNotation>{" "}
              </span>{" "}
              by writing, drawing, and <br /> syncing notes seamlessly across
              all your devices
            </p>
            <div className="flex justify-center gap-3 md:gap-x-9 items-center">
              <Button variant={"third"} styleMode="sketch" size={"lg"}>
                Join
              </Button>
              <span className="font-comic-neue">Or</span>
              <Button
                variant={"outline-black"}
                styleMode="sketch"
                size={"lg"}
                elevation={4}
              >
                Write
              </Button>
            </div>
          </div>
          <div className="flex-1  mx-auto w-full md:w-fit mb-auto pt-20 px-3">
            <Box elevation={4} className=" w-full md:w-[500px] h-full">
              <div className="p-4">
                <h5 className="text-primary-purple font-comic-neue font font-semibold">
                  What should i do ?
                </h5>
                <ReactSVG src="assets/images/scratch.svg" className="w-full" />
                <ReactSVG src="assets/images/scratch.svg" className="w-full" />
              </div>
            </Box>
          </div>
        </main>
      </div>
    </>
  );
}
