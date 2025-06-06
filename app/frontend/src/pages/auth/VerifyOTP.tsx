import Box from "@/components/atomic/Box";
import Button from "@/components/atomic/Button";
import { useModalDialog } from "@/components/atomic/Dialog";
import Input from "@/components/atomic/Input";
import PersonCheckPhone from "@/components/custom/PersonCheckPhone";
import { handleInputOnlyNumber } from "@/libs/common";
import { ParamPostVerifyCode, postVerifyCode } from "@/services/auth/auth";
import useGlobalStore from "@/stores/global";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

export default function VerifyOTP() {
  const TOTAL_BOX_OTP = 6;

  const navigate = useNavigate();
  const globalState = useGlobalStore((state) => state);
  const listOTPBox = useRef<Array<HTMLInputElement>>([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const combinedOtp = otp.join("");
  const [isEnoughOTP, setIsEnoughOTP] = useState(false);

  const { ModalDialog: DialogStatus, showDialog: showDialogStatus } =
    useModalDialog();

  const mutationVerifyCode = useMutation({
    mutationFn: (param: ParamPostVerifyCode) => postVerifyCode(param),
    onSuccess: async () => {
      const confirm = await showDialogStatus({
        title: "Verifikasi OTP",
        message: "Verifikasi OTP Berhasil",
      });

      if (confirm) {
        navigate("/note");
      }
    },
    onError: async () => {
      await showDialogStatus({
        title: "Gagal Verifikasi OTP",
        message: "OTP Yang dimasukan salah",
      });
    },
  });

  function handleOnPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const content = e.clipboardData.getData("Text");
    const max =
      content.length >= TOTAL_BOX_OTP ? TOTAL_BOX_OTP : content.length;

    listOTPBox.current.forEach((el, idx) => {
      if (idx < max) {
        el.value = content[idx];
      } else {
        el.value = "";
      }
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const otp = listOTPBox.current.map((el) => el.value);

    const stringOTP = otp.join("");

    mutationVerifyCode.mutate({
      email: globalState.loginEmailGlobal,
      code: stringOTP,
    });
  }

  function handleChange(index: number, value: string) {
    if (value.length > 1) return; // restrict to 1 char

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  }

  useEffect(() => {
    if (combinedOtp.trim().length === TOTAL_BOX_OTP) {
      setIsEnoughOTP(true);
    } else {
      setIsEnoughOTP(false);
    }
  }, [combinedOtp]);

  return (
    <>
      <div className="max-w-screen-xl mx-auto h-screen">
        <Helmet>
          <title>OTP</title>
        </Helmet>

        <div className="text-center mt-24">
          <h1 className="text-3xl font-bold font-comic-neue">Verify OTP</h1>
          <div className="w-72 mx-auto mt-5">
            <PersonCheckPhone happy={isEnoughOTP} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mt-6 grid grid-cols-6 gap-2 md:gap-11 px-5">
              {Array.from({ length: TOTAL_BOX_OTP }).map((_, idx) => (
                <div className="col-span-1" key={"VERIFBOX" + idx}>
                  <Input
                    className=" text-center  min-h-28 bg-transparent  text-3xl font-caveat"
                    ref={(el) => {
                      if (!el) return;
                      listOTPBox.current[idx] = el;
                    }}
                    type="text"
                    maxLength={1}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onInput={(e) => {
                      handleInputOnlyNumber(e);
                      const input = e.target as HTMLInputElement;
                      const lengthCharFill = input.value.length == 1;
                      const underTotal = idx < TOTAL_BOX_OTP - 1;

                      if (lengthCharFill && underTotal) {
                        listOTPBox.current[idx + 1].focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      const input = e.target as HTMLInputElement;
                      const isDeleting =
                        e.key === "Backspace" || e.key === "Delete";
                      const isEmpty = input.value === "";

                      const hasBefore = idx > 0;

                      if (isDeleting && isEmpty && hasBefore) {
                        e.preventDefault(); // prevent browser from default behavior
                        listOTPBox.current[idx - 1]?.focus();
                      }
                    }}
                    onPaste={handleOnPaste}
                  />
             
                </div>
              ))}
            </div>
            <Button
              styleMode="sketch"
              variant={"default"}
              className="mt-5"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
      <DialogStatus />
    </>
  );
}
