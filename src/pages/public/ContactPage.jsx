import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Input, Textarea, Select } from "../../components/ui/Form";
import { Button } from "../../components/ui/Button";

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  async function onSubmit(data) {
    await new Promise(r => setTimeout(r, 800));
    toast.success("Message sent! We will get back to you shortly.");
    reset();
  }

  return (
    <div className="flex-1 w-full flex flex-col pt-8 pb-12 z-20 overflow-y-auto pr-4 scrollbar-hide dark-form-wrapper">
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-wide text-gray-100 mb-2">Contact Us</h1>
        <p className="text-gray-400 text-sm font-light">We are here to help. Reach out via the form or contact us directly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <div className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-lg font-semibold text-gray-200 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 [&_label]:text-gray-300 [&_.input-field]:bg-white/5 [&_.input-field]:text-white [&_.input-field]:border-white/10 [&_.input-field]:focus:border-[#F07878] [&_option]:text-gray-900">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" required placeholder="Jane Doe" error={errors.name?.message}
                  {...register("name", { required: "Name is required" })} />
                <Input label="Email Address" required type="email" placeholder="jane@example.com" error={errors.email?.message}
                  {...register("email", { required: "Email is required" })} />
              </div>
              <Input label="Phone Number" placeholder="+264 81 000 0000" {...register("phone")} />
              <Select label="Subject" required error={errors.subject?.message}
                options={["General Inquiry","Printer Repair","Maintenance","Parts","Quote Request","Other"]}
                {...register("subject", { required: "Please select a subject" })} />
              <Textarea label="Message" required rows={5} placeholder="Tell us how we can help..." error={errors.message?.message}
                {...register("message", { required: "Message is required", minLength: { value: 10, message: "Message too short" } })} />
              <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto bg-[#F07878] hover:bg-[#d86a6a] text-white border-0 mt-4">Send Message</Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h3 className="font-semibold text-gray-200 mb-6">Contact Details</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#F07878]/10 text-[#F07878] flex items-center justify-center flex-shrink-0"><Phone className="w-4 h-4" /></div>
                <div><p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Phone</p>
                  <a href="tel:+264817854573" className="text-gray-300 hover:text-[#F07878] text-sm transition-colors">+264 81 785 4573</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#F07878]/10 text-[#F07878] flex items-center justify-center flex-shrink-0"><Mail className="w-4 h-4" /></div>
                <div><p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Email</p>
                  <a href="mailto:admin@technocurenam.com" className="text-gray-300 hover:text-[#F07878] text-sm transition-colors break-all">admin@technocurenam.com</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#F07878]/10 text-[#F07878] flex items-center justify-center flex-shrink-0"><MapPin className="w-4 h-4" /></div>
                <div><p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Location</p>
                  <p className="text-gray-300 text-sm">Namibia</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#F07878]/10 text-[#F07878] flex items-center justify-center flex-shrink-0"><Clock className="w-4 h-4" /></div>
                <div><p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Business Hours</p>
                  <p className="text-gray-300 text-sm">Mon–Fri: 08:00 – 17:00</p>
                  <p className="text-gray-300 text-sm">Saturday: 09:00 – 13:00</p>
                  <p className="text-gray-500 text-sm">Sunday: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
