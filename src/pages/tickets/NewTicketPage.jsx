import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CheckCircle, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ticketService } from "../../services/ticketService";
import { supabase } from "../../lib/supabase";
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
      
      // Manually trigger the edge function to send the email
      // This avoids the Supabase pg_net database webhook errors
      try {
        await supabase.functions.invoke('send-ticket-email', {
          body: { record: ticket }
        });
      } catch (emailErr) {
        console.error("Failed to send email notification", emailErr);
      }

      setSubmittedTicket(ticket);
      toast.success("Service ticket submitted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to submit ticket. Please try again.");
    }
  }

  if (submittedTicket) {
    return (
      <div className="flex-1 w-full flex flex-col pt-8 pb-12 z-20 overflow-y-auto pr-4 scrollbar-hide">
        <div className="max-w-lg w-full text-center mt-12 mx-auto">
          <div className="w-16 h-16 bg-[#F07878]/20 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-9 h-9 text-[#F07878]" />
          </div>
          <h1 className="text-2xl font-light text-gray-100 mb-2">Ticket Submitted!</h1>
          <p className="text-gray-400 mb-8 font-light">Your service request has been received. Our team will be in contact shortly.</p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Ticket Number</p>
              <p className="font-mono font-bold text-[#F07878] text-lg">{submittedTicket.ticket_number}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Submitted</p>
              <p className="text-sm text-gray-200 font-medium">{formatDate(submittedTicket.created_at)}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Status</p>
              <StatusBadge status={submittedTicket.status} />
            </div>
            <div className="border-t border-white/10 pt-3">
              <p className="text-sm text-gray-400 leading-relaxed font-light">Next step: Our team will review your request and contact you to arrange an assessment or repair.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={"/tickets/track?ticket=" + submittedTicket.ticket_number} className="bg-[#F07878] hover:bg-[#d86a6a] text-white py-2 px-6 rounded text-sm font-medium transition-colors">Track Your Ticket</Link>
            <button onClick={() => { setSubmittedTicket(null); setFiles([]); }} className="border border-white/20 hover:bg-white/10 text-white py-2 px-6 rounded text-sm font-medium transition-colors">Log Another Ticket</button>
          </div>
        </div>
      </div>
    );
  }

  const Section = ({ title, children }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <div className="bg-white/5 px-6 py-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">{title}</h2>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
    </div>
  );

  return (
    <div className="flex-1 w-full flex flex-col pt-8 pb-12 z-20 overflow-y-auto pr-4 scrollbar-hide dark-form-wrapper">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-wide text-gray-100 mb-2">Log a Service Ticket</h1>
        <p className="text-gray-400 text-sm font-light">Describe your printer issue and our team will get back to you promptly.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 [&_label]:text-gray-300 [&_.input-field]:bg-white/5 [&_.input-field]:text-white [&_.input-field]:border-white/10 [&_.input-field]:focus:border-[#F07878] [&_option]:text-gray-900 max-w-4xl">
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
            <label className="text-sm font-medium text-gray-300 block mb-3">Is the printer completely unusable?</label>
            <div className="flex gap-6">
              {["yes","no"].map(v => (
                <label key={v} className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input type="radio" value={v} {...register("is_completely_unusable")} className="accent-[#F07878]" />
                  <span className="text-sm capitalize">{v}</span>
                </label>
              ))}
            </div>
          </div>
        </Section>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Attachments (Optional)</h2>
          <div className="border border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-[#F07878] bg-white/5 transition-colors"
            onClick={() => document.getElementById("file-input").click()}>
            <Upload className="w-7 h-7 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-300 font-light">Click to upload photos, screenshots, or documents</p>
            <p className="text-xs text-gray-500 mt-1">Max 10MB per file</p>
          </div>
          <input id="file-input" type="file" multiple accept="image/*,application/pdf" className="hidden"
            onChange={e => setFiles(Array.from(e.target.files))} />
          {files.length > 0 && (
            <ul className="mt-4 space-y-1">{files.map((f, i) => <li key={i} className="text-sm text-gray-300 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#F07878]" />{f.name}</li>)}</ul>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
          <Link to="/" className="border border-white/20 hover:bg-white/10 text-white py-2 px-6 rounded text-sm font-medium transition-colors text-center">Cancel</Link>
          <Button type="submit" loading={isSubmitting} className="px-8 bg-[#F07878] hover:bg-[#d86a6a] text-white border-0 py-2.5">Submit Service Ticket</Button>
        </div>
      </form>
    </div>
  );
}
