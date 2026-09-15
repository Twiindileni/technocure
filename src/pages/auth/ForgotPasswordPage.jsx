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
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-brand-dark">Reset your password</h1>
        </div>
        <div className="card p-8">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="font-semibold text-brand-dark mb-2">Check your email</h2>
              <p className="text-brand-gray text-sm">We sent a password reset link to your email address.</p>
              <Link to="/auth/login" className="mt-6 inline-block text-brand-primary hover:underline text-sm font-medium">Back to login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <p className="text-sm text-brand-gray">Enter your email address and we will send you a link to reset your password.</p>
              <Input label="Email Address" type="email" required placeholder="you@example.com" error={errors.email?.message}
                {...register("email", { required: "Email is required" })} />
              <Button type="submit" loading={isSubmitting} className="w-full justify-center">Send Reset Link</Button>
              <div className="text-center"><Link to="/auth/login" className="text-sm text-brand-primary hover:underline">Back to login</Link></div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
