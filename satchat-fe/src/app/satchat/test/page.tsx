"use client";

import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";
import { Button } from "@mui/material";
import { commonStore } from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import { useAuth } from "@/context/auth-context";

export default function TestPage() {
  const { t } = useTranslation();
  const { logout } = useAuth();

  const dispatch = useDispatch();

  const loginUser = async ({ username, password }: any) => {
    username = "Alice";
    password = "password";
    const jsonPayload = await backendClient.login({
      username: username,
      password: password,
    });

    // If login success
    if (jsonPayload) {
      console.log("Login success", jsonPayload);
    }
  };

  const signout = async () => {
    console.log("Signing out...");
    logout();
  };
  return (
    <>
      <h1>{t("gretting")}</h1>
      <Button
        onClick={() => {
          dispatch(commonStore.actions.setErrorMessage("Test Error Message"));
        }}
      >
        {" "}
        Error msg
      </Button>
      <br />

      {/* Test Login */}
      <Button onClick={loginUser}>Login</Button>

      {/* Test Logout */}
      <Button onClick={signout}>Logout</Button>
    </>
  );
}
