"use client";

import { useEffect, useState } from "react";
import { Dumbbell } from "lucide-react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignUpForm";
import { useRouter } from "next/navigation";

export default function AuthenticationPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    isLogin
      ? router.push("/auth?method=signIn")
      : router.push("/auth?method=signUp");
  }, [isLogin]);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url(/img/hero/bg.png)" }}
    >
      {/* Lớp phủ làm tối nền */}
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10">
        {/* Tiêu đề */}
        <div className="flex items-center justify-between p-6">
          <div
            className="flex items-center gap-2 text-white"
            onClick={() => router.push("/")}
          >
            <Dumbbell className="h-8 w-8 text-red-500" />
            <span className="text-xl font-bold">GymMax</span>
          </div>
          <div className="text-red-400 hover:text-red-300 cursor-pointer">
            Cần trợ giúp?
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="flex min-h-[calc(100vh-88px)]">
          {/* Bên trái - Thương hiệu */}
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-white">
            <div className="text-center max-w-md">
              <div className="mb-8">
                <Dumbbell className="h-24 w-24 text-red-500 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">GymMax</div>
              </div>
              <h1 className="text-2xl font-semibold mb-4">
                Nền tảng thể hình hàng đầu
              </h1>
              <p className="text-lg text-zinc-300">
                Xây dựng cơ thể khỏe mạnh & tinh thần kiên cường
              </p>
            </div>
          </div>

          {/* Bên phải - Biểu mẫu đăng nhập/đăng ký */}
          <div className="w-[500px] bg-white p-8 shadow-2xl mr-8 my-8 rounded-lg">
            {isLogin ? (
              <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
            ) : (
              <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
