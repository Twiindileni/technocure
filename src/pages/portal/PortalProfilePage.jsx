import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { User, Lock, Mail, Calendar, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { supabase } from "../../lib/supabase";
import { Card, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Form";
import { Button } from "../../components/ui/Button";
import { formatDate } from "../../utils/formatters";

export default function PortalProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { register: rp, handleSubmit: hp, reset: resetP, formState: { errors: ep, isSubmitting: sp } } = useForm();
  const { register: rpw, handleSubmit: hpw, reset: resetPw, watch: wpw, formState: { errors: epw, isSubmitting: spw } } = useForm();

  useEffect(() => {
    if (profile) resetP({ full_name: profile.full_name || "", company: profile.company || "", phone: profile.phone || "", address: profile.address || "" });
  }, [profile, resetP]);

  async function onSaveProfile(data) {
    try { await authService.updateProfile(user.id, data); await refreshProfile(); toast.success("Profile updated!"); }
    catch { toast.error("Failed to update profile"); }
  }
  async function onChangePwd(data) {
    try { const { error } = await supabase.auth.updateUser({ password: data.new_password }); if (error) throw error; toast.success("Password changed!"); resetPw(); }
    catch (err) { toast.error(err.message || "Failed to change password"); }
  }
  const newPwd = wpw("new_password");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark">My Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader title="Personal Information" subtitle="Update your name, company and contact details" />
            <form onSubmit={hp(onSaveProfile)} className="space-y-4">
              <Input label="Full Name" required error={ep.full_name?.message} {...rp("full_name", { required: "Required" })} />
              <Input label="Company" {...rp("company")} />
              <Input label="Phone" {...rp("phone")} />
              <Input label="Address" {...rp("address")} />
              <Button type="submit" loading={sp}>Save Changes</Button>
            </form>
          </Card>
          <Card>
            <CardHeader title="Change Password" />
            <form onSubmit={hpw(onChangePwd)} className="space-y-4">
              <Input label="New Password" type="password" required error={epw.new_password?.message} {...rpw("new_password", { required: "Required", minLength: { value: 8, message: "Min 8 chars" } })} />
              <Input label="Confirm Password" type="password" required error={epw.confirm?.message} {...rpw("confirm", { required: "Required", validate: v => v === newPwd || "Passwords do not match" })} />
              <Button type="submit" loading={spw} variant="outline"><Lock className="w-4 h-4 mr-1.5" />Update Password</Button>
            </form>
          </Card>
        </div>
        <Card>
          <CardHeader title="Account Info" />
          <div className="space-y-4">
            {[[Mail, "Email", user?.email],[Calendar, "Member Since", formatDate(profile?.created_at)],[Shield, "Role", profile?.role || "Customer"]].map(([Icon, label, val]) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-primary-light flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4 text-brand-primary" /></div>
                <div><p className="text-xs text-brand-gray uppercase tracking-wide font-medium">{label}</p><p className="text-sm text-brand-dark mt-0.5">{val}</p></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
