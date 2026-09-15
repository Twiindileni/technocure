import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Printer, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/Form";
import { Button } from "../../components/ui/Button";
import { Logo } from "../../components/ui/Logo";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  async function onSubmit(data) {
    try {
      const authData = await login(data);
      const user = authData?.user;
      
      let redirectPath = "/portal";
      if (user) {
        // Fetch profile directly to determine role before navigating
        const { authService } = await import("../../services/authService");
        try {
          const profile = await authService.getProfile(user.id);
          if (["admin", "manager"].includes(profile.role)) {
            redirectPath = "/admin";
          } else if (profile.role === "technician") {
            redirectPath = "/technician";
          }
        } catch (e) {
          console.warn("Could not fetch profile for routing", e);
        }
      }

      toast.success("Welcome back!");
      navigate(redirectPath);
    } catch (err) {
      toast.error(err.message || "Invalid email or password");
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center pt-8 pb-12 z-20 overflow-y-auto pr-4 scrollbar-hide dark-form-wrapper">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-3xl font-light tracking-wide text-gray-100 mb-2">Sign In</h1>
          <p className="text-gray-400 text-sm font-light">Access your portal, tickets and order history.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 [&_label]:text-gray-300 [&_.input-field]:bg-white/5 [&_.input-field]:text-white [&_.input-field]:border-white/10 [&_.input-field]:focus:border-[#F07878]">
            <Input label="Email Address" type="email" required placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email", { required: "Email is required" })} />
            <div className="relative">
              <Input label="Password" type={showPwd ? "text" : "password"} required placeholder="Your password"
                error={errors.password?.message}
                {...register("password", { required: "Password is required" })} />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-white transition-colors">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex justify-end">
              <Link to="/auth/forgot-password" className="text-xs text-[#F07878] hover:text-[#d86a6a] transition-colors">Forgot password?</Link>
            </div>
            <Button type="submit" loading={isSubmitting} className="w-full justify-center text-sm py-3 bg-[#F07878] hover:bg-[#d86a6a] text-white border-0 transition-colors">Sign In</Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8 font-light">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-[#F07878] hover:text-[#d86a6a] font-medium transition-colors">Create one</Link>
        </p>
        <p className="text-center text-sm text-gray-400 mt-3 font-light">
          <Link to="/tickets/new" className="text-gray-300 hover:text-white border-b border-gray-600 hover:border-white pb-0.5 transition-all">Log a ticket without an account &rarr;</Link>
        </p>
      </div>
    </div>
  );
}
