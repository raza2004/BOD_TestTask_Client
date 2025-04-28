"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { SIGN_IN } from "@/graphql/mutations";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false); // new
  const router = useRouter();
  const [login] = useMutation(SIGN_IN);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await login({
        variables: { email, password },
      });

      localStorage.setItem("token", data.login.access_token);
      toast.success("Signin successful!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Signin failed");
    }
  };

  const gradientBackground = `linear-gradient(#006994, #00A3D9)`;

  // simple email validation
  const validateEmail = (email: string) => {
    return email.includes("@") && email.includes(".");
  };

  return (
    <div
      className="h-screen flex flex-row"
      style={{ background: gradientBackground }}
    >
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-[45vw] flex flex-col justify-center items-center bg-white h-auto rounded-[40px] text-[#01415a] p-16 m-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        <form onSubmit={handleSignin} className="w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (!emailTouched) setEmailTouched(true); // mark touched after first change
            }}
            placeholder="Email"
            className="bg-[#F3F3F3] p-2 mt-4 py-3 w-full rounded-md"
          />
          {/* Show error message only after 1st letter is typed */}
          {emailTouched && !validateEmail(email) && (
            <p className="text-red-500 text-sm mt-1">
              Please enter a valid email address
            </p>
          )}

          <div className="relative mt-4">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-[#F3F3F3] p-2 py-3 w-full rounded-md"
              required
            />
            <div
              className="absolute inset-y-0 right-1 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button
            type="submit"
            className={`rounded-md py-2 mt-6 w-full ${
              !validateEmail(email) || !password
                ? "bg-[#E5E5E5] text-[#A0A0A0] cursor-not-allowed"
                : "bg-[#01415a] text-white hover:bg-[#234955] transition-colors"
            }`}
            disabled={!validateEmail(email) || !password}
          >
            Sign In
          </button>
        </form>
        <h5 className="text-center mt-10">
          Don't have an account?{" "}
          <span className="text-[#347C8D] ml-1">
            <Link href="/signup">Sign Up</Link>
          </span>
        </h5>
      </div>
      <div className="items-center w-[50vw] justify-center flex">
        {/* Optional: Add your logo or illustration here */}
      </div>
    </div>
  );
}
