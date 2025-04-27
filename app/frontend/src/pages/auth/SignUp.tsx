import { Link } from "react-router-dom";
import Button from "@/components/atomic/Button";
import LandingNav from "@/components/compound/LandingNav";
import Input from "@/components/atomic/Input";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import PersonMovingEye from "@/components/custom/PersonMovingEye";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FORM_SCHEMA_SIGNUP } from "./formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { postSignUp, ParamPostSignUp } from "@/services/auth/auth";
import FormField from "@/components/atomic/FormField";
import { useModalDialog } from "@/components/atomic/Dialog";

export default function SignUp() {
  const WORD_LOGIN = "Let's join us!";
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const inputRef = useRef<HTMLDivElement[]>([]);

  const brandRef = useRef<HTMLDivElement[]>([]);

  const { ModalDialog: DialogStatus, showDialog: showDialogStatus } =
    useModalDialog();
  const formConfig = useForm<z.infer<typeof FORM_SCHEMA_SIGNUP>>({
    resolver: zodResolver(FORM_SCHEMA_SIGNUP),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const mutationSignUp = useMutation({
    mutationFn: (param: ParamPostSignUp) => postSignUp(param),
    onSuccess: (data) => {
      showDialogStatus({
        title: "Berhasil Sign Up",
        content: "Selamat bergabung, Silahkan cek email untuk kode OTP",
      });
    },
    onError: (error) => {
      showDialogStatus({ title: "Gagal Sign Up", content: error.message });
    },
  });

  function callbackSubmit(data: z.infer<typeof FORM_SCHEMA_SIGNUP>) {
    mutationSignUp.mutate(data);
  }

  //ANIMATION
  useEffect(() => {
    const tl = gsap.timeline({
      delay: 0.5,
    });
    letterRefs.current.forEach((el) => {
      tl.to(el, {
        duration: 0.1,
        visibility: "visible",
        ease: "sine",
      });
    });

    brandRef.current.forEach((el, i) => {
      if (el) {
        tl.fromTo(
          el,
          { scale: 0 },
          {
            scale: 1,
            ease: "bounce",
          },
          i * 0.1 // slight stagger
        );
      }
    });

    inputRef.current.forEach((el, i) => {
      if (el) {
        tl.fromTo(
          el,
          { translateY: -10, opacity: 0 },
          {
            translateY: 0,
            opacity: 1,
            duration: 0.5,
            ease: "bounce.out",
          },
          i * 0.1 // slight stagger
        );
      }
    });
  }, []);

  return (
    <div className="max-w-screen-2xl h-screen mx-auto">
      <LandingNav />
      <div className="mt-5 flex flex-col items-center max-w-lg mx-auto ">
        <h1>
          {WORD_LOGIN.split("").map((el, index) => (
            <span
              key={index}
              ref={(el) => (letterRefs.current[index] = el)}
              className="text-3xl text-primary-purple font-comic-neue font-semibold invisible"
            >
              {el}
            </span>
          ))}
        </h1>

        <div className="flex flex-col   gap-y-2">
          <PersonMovingEye />

          <div className="mx-auto gap-4 flex items-center">
            <div ref={(el) => (brandRef.current[0] = el!)}>
              <button className="hover:-translate-y-0.5 transition-all active:scale-95 active:translate-y-0 active:drop-shadow-none transform flex hover:drop-shadow-[3px_3px_#FFC04F]">
                <img
                  src="/assets/brand/google.png"
                  alt=""
                  className="flex w-7 h-7"
                />
              </button>
            </div>

            <div ref={(el) => (brandRef.current[1] = el!)}>
              <button className="hover:-translate-y-0.5 transition-all active:scale-95 active:translate-y-0 active:drop-shadow-none transform flex hover:drop-shadow-[3px_3px_#FFC04F]">
                <img
                  src="/assets/brand/github.png"
                  alt=""
                  className="flex w-7 h-7"
                />
              </button>
            </div>

            <div ref={(el) => (brandRef.current[2] = el!)}>
              <button className="hover:-translate-y-0.5 transition-all active:scale-95 active:translate-y-0 active:drop-shadow-none transform flex hover:drop-shadow-[3px_3px_#FFC04F]">
                <img
                  src="/assets/brand/fb.png"
                  alt=""
                  className="flex w-7 h-7"
                />
              </button>
            </div>
          </div>

          <span className="font-comic-neue text-center">Or</span>
          <form onSubmit={formConfig.handleSubmit(callbackSubmit)} className="">
            <div className="w-64 gap-y-2 flex flex-col">
              <div ref={(el) => (inputRef.current[0] = el!)}>
                <FormField error={formConfig.formState.errors.name}>
                  <Input
                    type="text"
                    placeholder="Name"
                    className="w-full"
                    {...formConfig.register("name")}
                  />
                </FormField>
              </div>
              <div ref={(el) => (inputRef.current[1] = el!)}>
                <FormField error={formConfig.formState.errors.email}>
                  <Input
                    type="text"
                    placeholder="Email"
                    className="w-full"
                    {...formConfig.register("email")}
                  />
                </FormField>
              </div>
              <div ref={(el) => (inputRef.current[2] = el!)}>
                <FormField error={formConfig.formState.errors.password}>
                  <Input
                    type="password"
                    placeholder="Password"
                    {...formConfig.register("password")}
                  />
                </FormField>
              </div>
            </div>

            <div className=" flex justify-center mt-4">
              <Button
                styleMode="sketch"
                size={"lg"}
                loading={mutationSignUp.isPending}
              >
                Sign Up
              </Button>
            </div>
          </form>
          <span className="text-xs font-comic-neue text-center">
            Already have an account?{" "}
            <Link to={"/sign-in"}>
              <span className="text-primary-purple">Sign In</span>
            </Link>
          </span>
        </div>
      </div>

      <DialogStatus />
    </div>
  );
}
