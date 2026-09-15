import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CheckCircle } from "lucide-react";
import { quoteService } from "../../services/quoteService";
import { useAuth } from "../../context/AuthContext";
import { Input, Textarea, Select } from "../../components/ui/Form";
import { Button } from "../../components/ui/Button";
import { useCart } from "../../context/CartContext";

const TYPES = ["Printer","Parts","Repair","Maintenance Contract","Business Support","Other"];

export default function RequestQuotePage() {
  const { user } = useAuth();
  const { items: cartItems, clear } = useCart();
  const [submitted, setSubmitted] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  async function onSubmit(data) {
    try {
      const cartSummary = cartItems.length > 0 ? "Cart items: " + cartItems.map(i => i.name + " x" + i.qty).join(", ") + ". " : "";
      const result = await quoteService.createQuote({
        ...data,
        customer_id: user?.id || null,
        quantity: Number(data.quantity) || 1,
        budget: data.budget ? Number(data.budget) : null,
        description: cartSummary + (data.description || ""),
      });
      clear();
      setSubmitted(result);
    } catch (err) {
      toast.error(err.message || "Failed to submit quote request");
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-brand-dark mb-2">Quote Request Submitted!</h1>
          <p className="text-brand-gray mb-6">We will review your request and send you a quote shortly.</p>
          <div className="card p-5 mb-6 text-left">
            <div className="flex justify-between text-sm"><span className="text-brand-gray">Quote Reference</span><span className="font-mono font-bold text-brand-primary">{submitted.quote_number}</span></div>
          </div>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-brand-dark mb-2">Request a Quote</h1>
      <p className="text-brand-gray mb-8">Fill in the form below and we will get back to you with a customised quote.</p>
      {cartItems.length > 0 && (
        <div className="bg-brand-primary-light border border-brand-primary/20 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-brand-dark mb-2">Items from your quote list ({cartItems.length}):</p>
          <ul className="space-y-1">{cartItems.map(i => <li key={i.id + i.type} className="text-sm text-brand-gray flex justify-between"><span>{i.name}</span><span>x{i.qty}</span></li>)}</ul>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input label="Full Name" required error={errors.full_name?.message} {...register("full_name", { required: "Required" })} />
          <Input label="Company" {...register("company")} />
          <Input label="Email" type="email" required error={errors.email?.message} {...register("email", { required: "Required" })} />
          <Input label="Phone" {...register("phone")} />
          <Select label="Request Type" required options={TYPES} error={errors.request_type?.message} {...register("request_type", { required: "Required" })} />
          <Input label="Quantity" type="number" min={1} defaultValue={1} {...register("quantity")} />
          <div className="sm:col-span-2">
            <Textarea label="Requirements / Description" required rows={4} error={errors.description?.message} {...register("description", { required: "Required" })} />
          </div>
          <Input label="Budget (optional, NAD)" type="number" placeholder="e.g. 5000" {...register("budget")} />
          <div className="sm:col-span-2"><Textarea label="Additional Notes" rows={2} {...register("notes")} /></div>
        </div>
        <Button type="submit" loading={isSubmitting} className="px-8 justify-center">Submit Quote Request</Button>
      </form>
    </div>
  );
}
