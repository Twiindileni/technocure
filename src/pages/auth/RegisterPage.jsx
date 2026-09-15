import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Printer } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/Form";
import { Button } from "../../components/ui/Button";
import { Logo } from "../../components/ui/Logo";

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  async function onSubmit(data) {
    try {
      await authRegister({ email: data.email, password: data.password, fullName: data.full_name, phone: data.phone, company: data.company });
      toast.success("Account created! Welcome to TechnoCure.");
      navigate("/portal");
    } catch (err) {
      toast.error(err.message || "Failed to create account");
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center pt-8 pb-12 z-20 overflow-y-auto pr-4 scrollbar-hide dark-form-wrapper">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-3xl font-light tracking-wide text-gray-100 mb-2">Create Account</h1>
          <p className="text-gray-400 text-sm font-light">Track your tickets and manage your service history.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 [&_label]:text-gray-300 [&_.input-field]:bg-white/5 [&_.input-field]:text-white [&_.input-field]:border-white/10 [&_.input-field]:focus:border-[#F07878]">
            <Input label="Full Name" required placeholder="Jane Doe" error={errors.full_name?.message} {...register("full_name", { required: "Full name is required" })} />
            <Input label="Company / Organisation" placeholder="Acme Corp" {...register("company")} />
            <Input label="Email Address" type="email" required placeholder="you@example.com" error={errors.email?.message} {...register("email", { required: "Email is required" })} />
            <Input label="Phone Number" placeholder="+264 81 000 0000" {...register("phone")} />
            <Input label="Password" type="password" required placeholder="Min. 8 characters" error={errors.password?.message}
              {...register("password", { required: "Password required", minLength: { value: 8, message: "Min. 8 characters" } })} />
            <Button type="submit" loading={isSubmitting} className="w-full justify-center text-sm py-3 bg-[#F07878] hover:bg-[#d86a6a] text-white border-0 transition-colors mt-2">Create Account</Button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-400 mt-8 font-light">Already have an account? <Link to="/auth/login" className="text-[#F07878] hover:text-[#d86a6a] font-medium transition-colors">Sign in</Link></p>
      </div>
    </div>
  );
}
