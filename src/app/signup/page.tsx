"use client";
import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { SIGN_UP } from "@/graphql/mutations";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [signup] = useMutation(SIGN_UP);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6; // Example rule: min 6 chars, you can make it stricter if needed
  };

  useEffect(() => {
    const emailValid = validateEmail(form.email);
    const passwordValid = validatePassword(form.password);

    setErrors({
      email:
        emailValid || form.email === "" ? "" : "Email is not in correct format",
      password:
        passwordValid || form.password === ""
          ? ""
          : "Password must be at least 6 characters",
    });

    setButtonDisabled(!(emailValid && passwordValid));
  }, [form.email, form.password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data, errors } = await signup({
        variables: { email: form.email, password: form.password },
      });
      if (errors) {
        console.error(errors);
        toast.error(errors[0].message);
      } else {
        localStorage.setItem("token", data.signup.access_token);
        toast.success("Signup successful!");
        router.push("/signin");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Signup failed");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const gradientBackground = `linear-gradient(#006994, #00A3D9)`;

  return (
    <div
      className="h-screen flex flex-row"
      style={{ background: gradientBackground }}
    >
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-[45vw] flex flex-col justify-center items-center bg-white h-auto rounded-[40px] text-[#01415a] p-16 m-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col mt-4">
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="bg-[#F3F3F3] p-2 py-3 w-full rounded-md"
            />
            {errors.email && (
              <span className="text-red-500 text-sm mt-1">{errors.email}</span>
            )}
          </div>

          <div className="relative flex flex-col mt-4">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="bg-[#F3F3F3] p-2 py-3 w-full rounded-md"
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">
                {errors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className={`rounded-md py-2 mt-6 w-full ${
              buttonDisabled
                ? "bg-[#E5E5E5] text-[#A0A0A0] cursor-not-allowed"
                : "bg-[#01415a] text-white"
            }`}
            disabled={buttonDisabled}
          >
            Sign Up
          </button>
        </form>

        <h5 className="text-center mt-10">
          Already have an account?{" "}
          <span className="text-[#00A3D9] ml-1">
            <Link href="/signin">Sign In</Link>
          </span>
        </h5>
      </div>

      <div className="items-center w-[50vw] justify-center flex">
        {/* You can add a Logo image here */}
      </div>
    </div>
  );
}
