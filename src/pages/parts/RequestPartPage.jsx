import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CheckCircle, Upload } from "lucide-react";
import { partsService } from "../../services/partsService";
import { useAuth } from "../../context/AuthContext";
import { Input, Textarea, Select } from "../../components/ui/Form";
import { Button } from "../../components/ui/Button";

const BRANDS = ["HP","Canon","Brother","Epson","Kyocera","Ricoh","Samsung","Xerox","Other"];

export default function RequestPartPage() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(null);
  const [files, setFiles]         = useState([]);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  async function onSubmit(data) {
    try {
      const result = await partsService.createPartRequest({
        ...data,
        customer_id: user?.id || null,
        quantity: Number(data.quantity) || 1,
      });
      setSubmitted(result);
    } catch (err) {
      toast.error(err.message || "Failed to submit request");
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-brand-dark mb-2">Part Request Submitted!</h1>
          <p className="text-brand-gray mb-6">Our team will search for your part and get back to you.</p>
          <div className="card p-5 text-left mb-6">
            <div className="flex justify-between text-sm"><span className="text-brand-gray">Request Number</span><span className="font-mono font-bold text-brand-primary">{submitted.request_number}</span></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop/parts" className="btn-secondary">Browse Parts</Link>
            <button onClick={() => setSubmitted(null)} className="btn-primary">Submit Another Request</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-dark">Request a Printer Part</h1>
        <p className="text-brand-gray mt-1">Can't find the part you need? Tell us what you're looking for and our team will source it.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <h2 className="sm:col-span-2 text-sm font-semibold text-brand-dark uppercase tracking-wide border-b border-brand-border pb-3">Your Details</h2>
          <Input label="Full Name" required error={errors.full_name?.message} {...register("full_name", { required: "Required" })} />
          <Input label="Company" {...register("company")} />
          <Input label="Email" type="email" required error={errors.email?.message} {...register("email", { required: "Required" })} />
          <Input label="Phone" required error={errors.phone?.message} {...register("phone", { required: "Required" })} />
        </div>
        <div className="card p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <h2 className="sm:col-span-2 text-sm font-semibold text-brand-dark uppercase tracking-wide border-b border-brand-border pb-3">Printer Details</h2>
          <Select label="Printer Brand" required options={BRANDS} error={errors.printer_brand?.message} {...register("printer_brand", { required: "Required" })} />
          <Input label="Printer Model" required error={errors.printer_model?.message} {...register("printer_model", { required: "Required" })} />
          <Input label="Serial Number" {...register("serial_number")} />
        </div>
        <div className="card p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <h2 className="sm:col-span-2 text-sm font-semibold text-brand-dark uppercase tracking-wide border-b border-brand-border pb-3">Part Details</h2>
          <Input label="Part Name" required placeholder="e.g. Fuser Unit" error={errors.requested_part?.message} {...register("requested_part", { required: "Required" })} />
          <Input label="Part Number (if known)" placeholder="e.g. RM1-6739" {...register("part_number")} />
          <Input label="Quantity" type="number" min={1} defaultValue={1} {...register("quantity")} />
          <div className="sm:col-span-2">
            <Textarea label="Description" required rows={3} placeholder="Describe the part and why you need it..."
              error={errors.description?.message} {...register("description", { required: "Required" })} />
          </div>
          <div className="sm:col-span-2"><Textarea label="Additional Notes" rows={2} {...register("notes")} /></div>
        </div>
        <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto px-8 justify-center">Submit Part Request</Button>
      </form>
    </div>
  );
}
