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
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-brand-dark">Create your account</h1>
          <p className="text-brand-gray mt-2 text-sm">Track your tickets and manage your service history.</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" required placeholder="Jane Doe" error={errors.full_name?.message} {...register("full_name", { required: "Full name is required" })} />
            <Input label="Company / Organisation" placeholder="Acme Corp" {...register("company")} />
            <Input label="Email Address" type="email" required placeholder="you@example.com" error={errors.email?.message} {...register("email", { required: "Email is required" })} />
            <Input label="Phone Number" placeholder="+264 81 000 0000" {...register("phone")} />
            <Input label="Password" type="password" required placeholder="Min. 8 characters" error={errors.password?.message}
              {...register("password", { required: "Password required", minLength: { value: 8, message: "Min. 8 characters" } })} />
            <Button type="submit" loading={isSubmitting} className="w-full justify-center text-base py-2.5">Create Account</Button>
          </form>
        </div>
        <p className="text-center text-sm text-brand-gray mt-6">Already have an account? <Link to="/auth/login" className="text-brand-primary hover:underline font-medium">Sign in</Link></p>
      </div>
    </div>
  );
}
