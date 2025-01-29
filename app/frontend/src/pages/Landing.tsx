import { Bars3Icon } from "@heroicons/react/24/outline";
import Button from "../components/Button";
import MediumDrawer from "../components/MediumDrawer";
import { useState } from "react";
import clsx from "clsx";
import { RoughNotation } from "react-rough-notation";
import { ReactSVG } from "react-svg";
import Box from "../components/Box";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import LandingNav from "../components/compound/LandingNav";

export default function Landing() {
  return (
    <>
      <Helmet>
        <title>Notebuk</title>
      </Helmet>

      <div className="max-w-screen-2xl mx-auto  h-screen flex flex-col">
        <LandingNav />
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
              <Link to={"/sign-up"}>
                <Button variant={"third"} styleMode="sketch" size={"lg"}>
                  Join
                </Button>
              </Link>
              <span className="font-comic-neue">Or</span>
              <Link to={"/note"}>
                <Button
                  variant={"outline-black"}
                  styleMode="sketch"
                  size={"lg"}
                >
                  Write
                </Button>
              </Link>
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
