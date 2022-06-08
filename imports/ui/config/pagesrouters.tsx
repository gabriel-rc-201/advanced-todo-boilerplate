// @ts-ignore
import React from "react";
import { HomeContainer } from "../pages/Home/Home";
import Signup from "../pages/SignUp/Signup";
import Signout from "../pages/SignOut/Signout";
import { EmailVerify } from "../pages/EmailVerify/EmailVerify";
import { RecoveryPassword } from "/imports/ui/pages/RecoveryPassword/RecoveryPassword";
import { ResetPassword } from "/imports/ui/pages/ResetPassword/ResetPassword";
import { SignIn } from "../pages/SignIn/Signin";

export const pagesRouterList = [
  {
    path: "/",
    exact: true,
    component: HomeContainer,
    isProtected: true,
  },
  {
    path: "/signin",
    component: SignIn,
    isProtected: false,
  },
  {
    path: "/signup",
    component: Signup,
    isProtected: false,
  },
  {
    path: "/signout",
    component: Signout,
    isProtected: true,
  },
  {
    path: "/recovery-password",
    component: RecoveryPassword,
  },
  {
    path: "/reset-password/:token",
    component: ResetPassword,
  },
  {
    path: "/enroll-account/:token",
    component: ResetPassword,
  },
  {
    path: "/verify-email/:token",
    component: EmailVerify,
  },
];
