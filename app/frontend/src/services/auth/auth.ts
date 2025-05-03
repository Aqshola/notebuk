import { API_RESPONSE } from "@/constants/types"
import { BASE_URL_API_BE } from "../../constants/general"


 export type ParamPostSignUp={
    name:string
    email:string
    password:string
 }

 type postSignUpRequest={
    name:string
    email:string
    password:string
 }

 type postSignUpResponse={
    userId:string
    name:string
    email:string
 }
 export async function postSignUp(param: ParamPostSignUp): Promise<API_RESPONSE<postSignUpResponse>> {
    const url = `${BASE_URL_API_BE}/auth/sign-up`;
  
    const payload:postSignUpRequest = {
      name: param.name,
      email: param.email,
      password: param.password,
    };
  
    try {
      const response = await fetch(url, {method:"POST",body: JSON.stringify(payload)});
      const res: API_RESPONSE<postSignUpResponse> = await response.json();
      if (!response.ok) {
        throw new Error(res.message || `ERROR ${response.status} : ${response.statusText}`);
      }
      return res;
    } catch (error) {
      throw error; // lempar lagi supaya bisa ditangkap di luar
    }
  }


  export type ParamPostVerifyCode={
    email:string
    code:string
  }

  type postVerifyCodeRequest={
    email:string
    code:string
  }
  type postVerifyCodeResponse={
    message:string
  }


  export async function postVerifyCode(param:ParamPostVerifyCode):Promise<API_RESPONSE<postVerifyCodeResponse>>{
    const url = `${BASE_URL_API_BE}/auth/validate`;
  
    const payload:postVerifyCodeRequest = {
      email: param.email,
      code:param.code
    };
  
    try {
      const response = await fetch(url, {method:"POST",body: JSON.stringify(payload),credentials:"include"});
      const res: API_RESPONSE<postVerifyCodeResponse> = await response.json();
      if (!response.ok) {
        throw new Error(res.message || `ERROR ${response.status} : ${response.statusText}`);
      }
      return res;
    } catch (error) {
      throw error; // lempar lagi supaya bisa ditangkap di luar
    }
  }