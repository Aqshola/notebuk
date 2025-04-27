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
  fetch("http://localhost:8000/")
  fetch("http://localhost:8000/",{method:"POST"})
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