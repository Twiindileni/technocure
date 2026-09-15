import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CheckCircle, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ticketService } from "../../services/ticketService";
import { Input, Textarea, Select } from "../../components/ui/Form";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/Badge";
import { formatDate } from "../../utils/formatters";

const BRANDS = ["HP","Canon","Brother","Epson","Kyocera","Ricoh","Samsung","Xerox","Other"];
const CATEGORIES = ["Paper Jam","Print Quality","Connectivity","Error Code","Not Printing","Slow Printing","Noise","Other"];
const PRIORITIES = ["Low","Normal","High","Urgent"];
const PRINTER_TYPES = ["Inkjet","Laser","Multifunction","Label","Other"];

export default function NewTicketPage() {
  const { user } = useAuth();
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [files, setFiles] = useState([]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { priority: "Normal" }
  });

  async function onSubmit(data) {
    try {
      const payload = {
        ...data,
        customer_id: user?.id || null,
        is_completely_unusable: data.is_completely_unusable === "yes",
      };
      const ticket = await ticketService.createTicket(payload);
      setSubmittedTicket(ticket);
      toast.success("Service ticket submitted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to submit ticket. Please try again.");
    }
  }

  if (submittedTicket) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-brand-dark mb-2">Ticket Submitted Successfully!</h1>
          <p className="text-brand-gray mb-6">Your service request has been received. Our team will be in contact shortly.</p>
          <div className="card p-6 text-left space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <p className="text-sm text-brand-gray">Ticket Number</p>
              <p className="font-mono font-bold text-brand-primary text-lg">{submittedTicket.ticket_number}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-brand-gray">Submitted</p>
              <p className="text-sm text-brand-dark font-medium">{formatDate(submittedTicket.created_at)}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-brand-gray">Status</p>
              <StatusBadge status={submittedTicket.status} />
            </div>
            <div className="border-t border-brand-border pt-3">
              <p className="text-sm text-brand-gray">Next step: Our team will review your request and contact you to arrange an assessment or repair.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={"/tickets/track?ticket=" + submittedTicket.ticket_number} className="btn-primary">Track Your Ticket</Link>
            <button onClick={() => { setSubmittedTicket(null); setFiles([]); }} className="btn-secondary">Log Another Ticket</button>
          </div>
        </div>
      </div>
    );
  }

  const Section = ({ title, children }) => (
    <div className="card overflow-hidden">
      <div className="bg-brand-bg px-6 py-3 border-b border-brand-border">
        <h2 className="text-sm font-semibold text-brand-dark uppercase tracking-wide">{title}</h2>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-dark">Log a Service Ticket</h1>
        <p className="text-brand-gray mt-1">Describe your printer issue and our team will get back to you promptly.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Section title="Customer Information">
          <Input label="Full Name" required error={errors.full_name?.message} {...register("full_name", { required: "Required" })} />
          <Input label="Company" {...register("company")} />
          <Input label="Email" type="email" required error={errors.email?.message} {...register("email", { required: "Required" })} />
          <Input label="Phone Number" required error={errors.phone?.message} {...register("phone", { required: "Required" })} />
          <div className="sm:col-span-2">
            <Input label="Address" {...register("address")} />
          </div>
        </Section>

        <Section title="Printer Information">
          <Select label="Printer Brand" required options={BRANDS} error={errors.printer_brand?.message} {...register("printer_brand", { required: "Required" })} />
          <Input label="Printer Model" required error={errors.printer_model?.message} {...register("printer_model", { required: "Required" })} />
          <Input label="Serial Number" {...register("serial_number")} />
          <Select label="Printer Type" options={PRINTER_TYPES} {...register("printer_type")} />
          <div className="sm:col-span-2">
            <Input label="Location / Department" placeholder="e.g. Finance Department, Floor 2" {...register("printer_location")} />
          </div>
        </Section>

        <Section title="Problem Details">
          <Select label="Problem Category" required options={CATEGORIES} error={errors.issue_category?.message} {...register("issue_category", { required: "Required" })} />
          <Select label="Priority" required options={PRIORITIES} error={errors.priority?.message} {...register("priority", { required: "Required" })} />
          <div className="sm:col-span-2">
            <Textarea label="Problem Description" required rows={4} placeholder="Describe the issue in detail..."
              error={errors.description?.message}
              {...register("description", { required: "Required", minLength: { value: 15, message: "Please provide more detail" } })} />
          </div>
          <Input label="Error Code (if any)" placeholder="e.g. E5, 0x00000709" {...register("error_code")} />
          <Input label="When did the problem start?" type="date" {...register("problem_start_date")} />
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-brand-dark block mb-2">Is the printer completely unusable?</label>
            <div className="flex gap-5">
              {["yes","no"].map(v => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value={v} {...register("is_completely_unusable")} className="accent-brand-primary" />
                  <span className="text-sm capitalize">{v}</span>
                </label>
              ))}
            </div>
          </div>
        </Section>

        <div className="card p-6">
          <h2 className="text-sm font-semibold text-brand-dark uppercase tracking-wide mb-4">Attachments (Optional)</h2>
          <div className="border-2 border-dashed border-brand-border rounded-lg p-6 text-center cursor-pointer hover:border-brand-primary transition-colors"
            onClick={() => document.getElementById("file-input").click()}>
            <Upload className="w-7 h-7 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-brand-gray">Click to upload photos, screenshots, or documents</p>
            <p className="text-xs text-gray-400 mt-1">Max 10MB per file</p>
          </div>
          <input id="file-input" type="file" multiple accept="image/*,application/pdf" className="hidden"
            onChange={e => setFiles(Array.from(e.target.files))} />
          {files.length > 0 && (
            <ul className="mt-3 space-y-1">{files.map((f, i) => <li key={i} className="text-sm text-brand-gray flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />{f.name}</li>)}</ul>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Link to="/" className="btn-secondary text-center">Cancel</Link>
          <Button type="submit" loading={isSubmitting} className="px-8">Submit Service Ticket</Button>
        </div>
      </form>
    </div>
  );
}
