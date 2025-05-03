import Box from "@/components/atomic/Box";
import Button from "@/components/atomic/Button";
import PersonCheckPhone from "@/components/custom/PersonCheckPhone";
import { handleInputOnlyNumber } from "@/libs/common";
import { ParamPostVerifyCode, postVerifyCode } from "@/services/auth/auth";
import useGlobalStore from "@/stores/global";
import { useMutation } from "@tanstack/react-query";
import React, { useRef } from "react";
import { Helmet } from "react-helmet";

export default function VerifyOTP() {
  const listOTPBox = useRef<Array<HTMLInputElement>>([]);
  const globalState=useGlobalStore(state=>state)

  const TOTAL_BOX_OTP = 6;

  const mutationVerifyCode=useMutation({
      mutationFn:(param:ParamPostVerifyCode)=>postVerifyCode(param)
  })

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

  function handleSubmit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const otp=listOTPBox.current.map(el=>el.value)
    
    const stringOTP=otp.join("")

    mutationVerifyCode.mutate({
      email:globalState.loginEmailGlobal,
      code:stringOTP
    })
  }





  return (
    <div className="max-w-screen-xl mx-auto h-screen">
      <Helmet>
        <title>OTP</title>
      </Helmet>

      <div className="text-center mt-24">
        <h1 className="text-3xl font-bold font-comic-neue">Verify OTP</h1>
        <div className="w-72 mx-auto mt-5">
       <PersonCheckPhone/>
        </div>
        <form onSubmit={handleSubmit}>
        <div className="mt-6 grid grid-cols-6 gap-2 md:gap-11 px-5">
          {Array.from({ length: TOTAL_BOX_OTP }).map((_, idx) => (
            <div className="col-span-1" key={"VERIFBOX" + idx}>
              <Box>
                <input
                  ref={(el) => {
                    if (!el) return;
                    listOTPBox.current[idx] = el;
                  }}
                  type="text"
                  maxLength={1}
                  className="w-full h-full text-center  min-h-28 bg-transparent border text-3xl font-caveat"
                  onInput={(e) => {
                    handleInputOnlyNumber(e);
                    const input = e.target as HTMLInputElement;
                    const lengthCharFill = input.value.length == 1;
                    const underTotal = idx < TOTAL_BOX_OTP - 1;

                    if (lengthCharFill && underTotal) {
                      listOTPBox.current[idx + 1].focus();
                    }
                  }}
                  onPaste={handleOnPaste}
                />
              </Box>
            </div>
          ))}
        </div>
        <Button styleMode="sketch" variant={"default"} className="mt-5" type="submit">
          Submit
        </Button>
        </form>
      </div>
    </div>
  );
}
