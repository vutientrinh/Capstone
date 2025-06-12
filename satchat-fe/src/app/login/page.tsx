"use client";

import { useAuth } from "@/context/auth-context";
import { HOST_API } from "@/global-config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ username, password });
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated]);

  return (
    <>
      <style jsx>{`
        .container {
          display: flex;
          width: 100%;
          min-height: 100vh;
        }

        .form-container {
          flex: 1;
          padding: 40px;
          display: flex;
          flex-direction: column;
        }

        .brand {
          color: #5661f7;
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 60px;
        }

        .signin-form {
          max-width: 450px;
          margin: 0 auto;
          width: 100%;
        }

        .form-header {
          margin-bottom: 40px;
          text-align: center;
        }

        .form-header h1 {
          font-size: 2rem;
          margin-bottom: 10px;
          color: var(--foreground); //#212529;
        }

        .form-header p {
          color: var(--foreground); //#6c757d;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 0.9rem;
          color: var(--foreground); //#212529;
        }

        .form-group label span {
          color: #dc3545;
        }

        .form-control {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ced4da;
          border-radius: 5px;
          font-size: 1rem;
          background-color: var(--background); //#f1f1f1;
        }

        .password-field {
          position: relative;
        }

        .password-field .toggle-password {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #6c757d;
        }

        .remember-forgot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .remember-me {
          display: flex;
          align-items: center;
        }

        .remember-me input {
          margin-right: 8px;
        }

        .forgot-password {
          color: #5661f7;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .btn-primary {
          width: 100%;
          padding: 12px;
          background-color: #5661f7;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 10px;
        }

        .btn-primary:hover {
          background-color: #4550e6;
        }

        .social-login {
          margin-top: 30px;
          text-align: center;
        }

        .social-login p {
          color: #6c757d;
          margin-bottom: 15px;
          position: relative;
        }

        .social-login p::before,
        .social-login p::after {
          content: "";
          display: inline-block;
          width: 35%;
          height: 1px;
          background-color: #e0e0e0;
          position: absolute;
          top: 50%;
        }

        .social-login p::before {
          left: 0;
        }

        .social-login p::after {
          right: 0;
        }

        .google-login-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background-color: var(--background-component); /* hoặc #f1f1f1 */
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 10px 20px;
          color: #000;
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .google-login-button:hover {
          background-color: #e6e6e6;
        }

        .google-icon {
          font-size: 18px;
        }

        .create-account {
          text-align: center;
          margin-top: 30px;
          color: #6c757d;
        }

        .create-account a {
          color: #5661f7;
          text-decoration: none;
          font-weight: bold;
        }

        .image-container {
          flex: 1;
          background-image: url("/api/placeholder/550/800");
          background-size: cover;
          background-position: center;
        }

        @media (max-width: 768px) {
          .container {
            flex-direction: column;
          }

          .image-container {
            display: none;
          }
        }
      `}</style>

      <div className="form-container">
        <div className="brand">Connected</div>

        <div className="signin-form">
          <div className="form-header">
            <h1>Sign in</h1>
            <p>Welcome back! Please enter your details</p>
          </div>

          <form>
            <div className="form-group">
              <label htmlFor="email">
                Email or username <span>*</span>
              </label>
              <input
                type="text"
                id="email"
                className="form-control"
                placeholder="Enter your email or username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password <span>*</span>
              </label>
              <div className="password-field">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  className="form-control"
                  placeholder="************"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

            <div className="remember-forgot">
              <div className="remember-me">
                <input type="checkbox" id="remember" name="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link href="/forgot-password">
                <p style={{ color: "#5661F7" }}>Forgot password?</p>
              </Link>
            </div>

            <button
              type="submit"
              className="btn-primary"
              onClick={handleSubmit}
            >
              Sign in
            </button>
          </form>

          <div className="social-login">
            <p>Or sign in with</p>
            <a
              href={`${HOST_API}/oauth2/authorization/google`}
              className="google-login-button"
            >
              <FcGoogle size={20} style={{ marginRight: "10px" }} />
              Đăng nhập với Google
            </a>
          </div>

          <div className="create-account">
            Don&apos;t have an account?{" "}
            <Link href="/register">
              <p style={{ color: "#5661F7" }}>Sign up</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
