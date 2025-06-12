"use client";

import { commonStore } from "@/store/reducers";
import backendClient from "@/utils/BackendClient";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await backendClient.sendRecoveryEmail(email);
      if (response.status === 200) {
        dispatch(
          commonStore.actions.setSuccessMessage(
            "Recovery email sent successfully. Please check your inbox."
          )
        );
      } else {
        dispatch(
          commonStore.actions.setErrorMessage(
            "Failed to send recovery email. Please try again."
          )
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
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

        .reset-form {
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
          line-height: 1.5;
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
          background-color: var(--background-component); //#f1f1f1;
          ::placeholder {
            color: var(--foreground); //#6c757d;
          }
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
          margin-top: 20px;
        }

        .btn-primary:hover {
          background-color: #4550e6;
        }

        .back-to-login {
          text-align: center;
          margin-top: 30px;
          color: #6c757d;
        }

        .back-to-login a {
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

        .reset-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: rgba(86, 97, 247, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 30px;
        }

        .reset-icon svg {
          width: 40px;
          height: 40px;
          color: #5661f7;
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

        <div className="reset-form">
          <div className="reset-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#5661F7"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>

          <div className="form-header">
            <h1>Forgot Password</h1>
            <p>
              No worries, we&apos;ll send you reset instructions.
              <br />
              Enter your email and we&apos;ll send you a link to reset your
              password.
            </p>
          </div>

          <form>
            <div className="form-group">
              <label htmlFor="email">
                Email address <span>*</span>
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              onClick={handleSubmit}
            >
              Reset password
            </button>
          </form>

          <div className="back-to-login">
            Remembered your password? <a href="/login">Back to sign in</a>
          </div>
        </div>
      </div>
    </>
  );
}
