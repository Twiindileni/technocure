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
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-brand-dark">Sign in to your account</h1>
          <p className="text-brand-gray mt-2 text-sm">Access your portal, tickets and order history.</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input label="Email Address" type="email" required placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email", { required: "Email is required" })} />
            <div className="relative">
              <Input label="Password" type={showPwd ? "text" : "password"} required placeholder="Your password"
                error={errors.password?.message}
                {...register("password", { required: "Password is required" })} />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-brand-gray">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex justify-end">
              <Link to="/auth/forgot-password" className="text-sm text-brand-primary hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" loading={isSubmitting} className="w-full justify-center text-base py-2.5">Sign In</Button>
          </form>
        </div>

        <p className="text-center text-sm text-brand-gray mt-6">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-brand-primary hover:underline font-medium">Create one</Link>
        </p>
        <p className="text-center text-sm text-brand-gray mt-2">
          <Link to="/tickets/new" className="text-brand-primary hover:underline">Log a ticket without an account →</Link>
        </p>
      </div>
    </div>
  );
}
