import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

interface SignUpPageProps {
  onNavigate: (page: string) => void;
}

export default function SignUpPage({
  onNavigate,
}: SignUpPageProps): React.ReactElement {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal harus 6 karakter.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const nameParts = fullName.trim().split(" ");
      const namaDepan = nameParts[0];
      const namaBelakang =
        nameParts.length > 1 ? nameParts.slice(1).join(" ") : null;

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nama_depan: namaDepan,
            nama_belakang: namaBelakang,
          },
        },
      });

      if (signUpError) throw signUpError;

      setSuccess(true);

      setTimeout(() => {
        onNavigate("login");
      }, 2500);
    } catch (err: unknown) {
      console.error("Sign Up Error:", err);
      if (err instanceof Error) {
        setError(
          err.message === "User already registered"
            ? "Email ini sudah terdaftar. Silakan login."
            : err.message,
        );
      } else {
        setError("Terjadi kesalahan saat membuat akun. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-kms-gray-bg py-16 px-4 w-full">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-[5px] shadow-sm border border-gray-200/60 text-left space-y-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Sign Up
          </h1>

          {success ? (
            <div className="text-sm text-kms-green-status bg-green-50 p-4 rounded-[5px] border border-green-200 font-medium">
              Pendaftaran berhasil! Mengarahkan Anda ke halaman login...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div
                  className="text-sm text-kms-red bg-red-50 p-2.5 rounded-[5px] border border-red-200"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="fullName"
                  className="text-sm font-semibold text-gray-700 block"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2.5 text-sm outline-none transition-all duration-200 focus:border-kms-blue-accent focus:ring-1 focus:ring-kms-blue-accent/20 placeholder-gray-400"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700 block"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@gmail.com"
                  className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2.5 text-sm outline-none transition-all duration-200 focus:border-kms-blue-accent focus:ring-1 focus:ring-kms-blue-accent/20 placeholder-gray-400"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700 block"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="**********"
                  minLength={6}
                  className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2.5 text-sm outline-none transition-all duration-200 focus:border-kms-blue-accent focus:ring-1 focus:ring-kms-blue-accent/20 placeholder-gray-400"
                  disabled={isLoading}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-kms-blue-accent hover:bg-blue-700 active:scale-98 disabled:opacity-75 disabled:pointer-events-none text-white text-sm font-bold py-3 rounded-[5px] transition-all duration-200 cursor-pointer flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Membuat Akun...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => onNavigate("login")}
              className="text-xs text-kms-blue-accent hover:underline font-semibold cursor-pointer"
            >
              Sudah punya akun? Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
