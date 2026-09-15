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
    <div>
      <div className="bg-brand-dark py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-brand-primary text-sm font-semibold uppercase tracking-widest mb-3">Get In Touch</p>
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-gray-400 text-lg">We are here to help. Reach out via the form or contact us directly.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <div className="card p-8">
              <h2 className="text-xl font-bold text-brand-dark mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">Send Message</Button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className="card p-6">
              <h3 className="font-semibold text-brand-dark mb-5">Contact Details</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-primary-light text-brand-primary flex items-center justify-center flex-shrink-0"><Phone className="w-4 h-4" /></div>
                  <div><p className="text-xs text-brand-gray uppercase tracking-wide font-medium">Phone</p>
                    <a href="tel:+264817854573" className="text-brand-dark hover:text-brand-primary font-medium">+264 81 785 4573</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-primary-light text-brand-primary flex items-center justify-center flex-shrink-0"><Mail className="w-4 h-4" /></div>
                  <div><p className="text-xs text-brand-gray uppercase tracking-wide font-medium">Email</p>
                    <a href="mailto:admin@technocurenam.com" className="text-brand-dark hover:text-brand-primary font-medium break-all">admin@technocurenam.com</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-primary-light text-brand-primary flex items-center justify-center flex-shrink-0"><MapPin className="w-4 h-4" /></div>
                  <div><p className="text-xs text-brand-gray uppercase tracking-wide font-medium">Location</p>
                    <p className="text-brand-dark">Namibia</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-primary-light text-brand-primary flex items-center justify-center flex-shrink-0"><Clock className="w-4 h-4" /></div>
                  <div><p className="text-xs text-brand-gray uppercase tracking-wide font-medium">Business Hours</p>
                    <p className="text-brand-dark text-sm">Mon–Fri: 08:00 – 17:00</p>
                    <p className="text-brand-dark text-sm">Saturday: 09:00 – 13:00</p>
                    <p className="text-brand-gray text-sm">Sunday: Closed</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="card p-0 overflow-hidden">
              <div className="h-48 bg-brand-bg flex items-center justify-center border-b border-brand-border">
                <div className="text-center text-brand-gray">
                  <MapPin className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Map integration coming soon</p>
                </div>
              </div>
              <div className="px-5 py-3 bg-white text-xs text-brand-gray">Namibia — exact address available on request</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
