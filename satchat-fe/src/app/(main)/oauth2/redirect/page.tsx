"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { setCookie } from "cookies-next";
import { useAuth } from "@/context/auth-context";

export default function OAuth2RedirectWrapper() {
  return (
    <Suspense fallback={<p>Đang đăng nhập, vui lòng chờ...</p>}>
      <OAuth2Redirect />
    </Suspense>
  );
}

function OAuth2Redirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuthFromOAuth } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const username = searchParams.get("username");
    const role = searchParams.get("role");

    if (token && username) {
      setCookie("token", token);
      setCookie("username", username);
      setCookie("role", role || "ROLE_USER");

      setAuthFromOAuth({ token, username });

      router.push("/");
    }
  }, []);

  return <p>Đang đăng nhập, vui lòng chờ...</p>;
}
