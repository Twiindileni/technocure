import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Printer, CheckCircle } from "lucide-react";
import { authService } from "../../services/authService";
import { Input } from "../../components/ui/Form";
import { Button } from "../../components/ui/Button";
import { Logo } from "../../components/ui/Logo";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  async function onSubmit({ email }) {
    try {
      await authService.resetPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(err.message || "Failed to send reset email");
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center pt-8 pb-12 z-20 overflow-y-auto pr-4 scrollbar-hide dark-form-wrapper">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-3xl font-light tracking-wide text-gray-100 mb-2">Reset Password</h1>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 shadow-xl">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-[#F07878] mx-auto mb-4" />
              <h2 className="font-semibold text-gray-200 mb-2">Check your email</h2>
              <p className="text-gray-400 text-sm font-light">We sent a password reset link to your email address.</p>
              <Link to="/auth/login" className="mt-6 inline-block text-[#F07878] hover:text-[#d86a6a] transition-colors text-sm font-medium">Back to login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 [&_label]:text-gray-300 [&_.input-field]:bg-white/5 [&_.input-field]:text-white [&_.input-field]:border-white/10 [&_.input-field]:focus:border-[#F07878]">
              <p className="text-sm text-gray-400 font-light mb-2">Enter your email address and we will send you a link to reset your password.</p>
              <Input label="Email Address" type="email" required placeholder="you@example.com" error={errors.email?.message}
                {...register("email", { required: "Email is required" })} />
              <Button type="submit" loading={isSubmitting} className="w-full justify-center text-sm py-3 bg-[#F07878] hover:bg-[#d86a6a] text-white border-0 transition-colors mt-2">Send Reset Link</Button>
              <div className="text-center mt-4"><Link to="/auth/login" className="text-sm text-[#F07878] hover:text-[#d86a6a] transition-colors">Back to login</Link></div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
