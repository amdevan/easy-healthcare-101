import React, { useState } from 'react';
import { Check, Clock, Phone, User, Mail, Calendar, FileText, Loader2 } from 'lucide-react';
import { createAppointment } from '@/controllers/api';

interface AppointmentFormProps {
  title?: string;
  subtitle?: string;
  successTitle?: string;
  successMessage?: string;
  contactInfo?: {
    hoursTitle?: string;
    hoursWeek?: string;
    hoursSat?: string;
    hoursSun?: string;
    supportTitle?: string;
    supportEmergency?: string;
    supportLine?: string;
  };
  labels?: {
    name?: string;
    phone?: string;
    email?: string;
    date?: string;
    time?: string;
    reason?: string;
    submit?: string;
  };
  placeholders?: {
    name?: string;
    phone?: string;
    email?: string;
    reason?: string;
  };
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  title, 
  subtitle, 
  successTitle, 
  successMessage, 
  contactInfo,
  labels,
  placeholders
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: 'Morning (8am - 12pm)',
    reason: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const scheduledAt = new Date(`${formData.date}T09:00:00`).toISOString();
      const notes = `Reason: ${formData.reason}\nPreferred Time: ${formData.time}\nEmail: ${formData.email}`;

      await createAppointment({
        patient_name: formData.name,
        phone: formData.phone,
        scheduled_at: scheduledAt,
        notes: notes,
        doctor_id: null, // General appointment
        status: 'pending'
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit appointment request.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section id="appointment" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="w-10 h-10 text-green-600" /></div>
             <div className="text-3xl font-bold text-slate-900 mb-4" dangerouslySetInnerHTML={{ __html: successTitle || "Request Received!" }} />
             <div className="text-lg text-slate-600 mb-8" dangerouslySetInnerHTML={{ __html: successMessage || "Thank you for your request. Our team will contact you shortly to confirm your appointment time." }} />
             <button onClick={() => { setSubmitted(false); setFormData({ name: '', phone: '', email: '', date: '', time: 'Morning (8am - 12pm)', reason: '' }); }} className="text-teal-600 font-semibold hover:underline">Book another appointment</button>
           </div>
        </div>
      </section>
    );
  }
  return (
    <section id="appointment" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          <div className="lg:w-5/12 space-y-6">
            <div className="text-3xl font-bold text-slate-900" dangerouslySetInnerHTML={{ __html: title || "Book Your Consultation" }} />
            <div className="text-slate-600" dangerouslySetInnerHTML={{ __html: subtitle || "Prioritize your health with our flexible scheduling. We offer same-day appointments for acute needs and convenient slots for routine check-ups." }} />
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-teal-50 p-3 rounded-lg text-teal-600"><Clock size={24} /></div>
                <div>
                  <div className="font-bold text-slate-900" dangerouslySetInnerHTML={{ __html: contactInfo?.hoursTitle || "Clinic Hours" }} />
                  <div className="text-sm text-slate-500 mt-1" dangerouslySetInnerHTML={{ __html: contactInfo?.hoursWeek || "Mon - Fri: 8:00 AM - 8:00 PM" }} />
                  <div className="text-sm text-slate-500" dangerouslySetInnerHTML={{ __html: contactInfo?.hoursSat || "Sat: 9:00 AM - 5:00 PM" }} />
                  <div className="text-sm text-slate-500" dangerouslySetInnerHTML={{ __html: contactInfo?.hoursSun || "Sun: Closed" }} />
                </div>
              </div>
              <div className="w-full h-px bg-slate-100 my-4"></div>
              <div className="flex items-start gap-4">
                <div className="bg-teal-50 p-3 rounded-lg text-teal-600"><Phone size={24} /></div>
                <div>
                  <div className="font-bold text-slate-900" dangerouslySetInnerHTML={{ __html: contactInfo?.supportTitle || "Support Contact" }} />
                  <div className="text-sm text-slate-500 mt-1" dangerouslySetInnerHTML={{ __html: contactInfo?.supportEmergency || "For life-threatening emergencies, please call local emergency services." }} />
                  <div className="text-sm text-slate-500 mt-1" dangerouslySetInnerHTML={{ __html: contactInfo?.supportLine || "Clinic Line: (555) 019-2834" }} />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-7/12">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-t-4 border-teal-600">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="block text-sm font-medium text-slate-700 mb-2" dangerouslySetInnerHTML={{ __html: labels?.name || "Full Name" }} />
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      required 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none" 
                      placeholder={placeholders?.name || "John Doe"} 
                    />
                  </div>
                </div>
                <div>
                  <div className="block text-sm font-medium text-slate-700 mb-2" dangerouslySetInnerHTML={{ __html: labels?.phone || "Phone Number" }} />
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      required 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none" 
                      placeholder={placeholders?.phone || "(555) 000-0000"} 
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="block text-sm font-medium text-slate-700 mb-2" dangerouslySetInnerHTML={{ __html: labels?.email || "Email Address" }} />
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      required 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none" 
                      placeholder={placeholders?.email || "john@example.com"} 
                    />
                  </div>
                </div>
                <div>
                  <div className="block text-sm font-medium text-slate-700 mb-2" dangerouslySetInnerHTML={{ __html: labels?.date || "Preferred Date" }} />
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      required 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <div className="block text-sm font-medium text-slate-700 mb-2" dangerouslySetInnerHTML={{ __html: labels?.time || "Time Slot" }} />
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 text-slate-400" size={18} />
                    <select 
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none appearance-none"
                    >
                      <option>Morning (8am - 12pm)</option>
                      <option>Afternoon (12pm - 4pm)</option>
                      <option>Evening (4pm - 8pm)</option>
                    </select>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="block text-sm font-medium text-slate-700 mb-2" dangerouslySetInnerHTML={{ __html: labels?.reason || "Reason for Visit" }} />
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-slate-400" size={18} />
                    <textarea 
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none h-24 resize-none" 
                      placeholder={placeholders?.reason || "Briefly describe your symptoms or check-up needs..."}
                    ></textarea>
                  </div>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-lg shadow-teal-100 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <div dangerouslySetInnerHTML={{ __html: 'Processing...' }} />
                  </>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: labels?.submit || "Confirm Appointment" }} />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;
