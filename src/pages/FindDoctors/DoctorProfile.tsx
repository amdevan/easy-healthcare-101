import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Clock, Stethoscope, Building, Calendar, ShieldCheck, User, Activity, Video, Home, Briefcase } from 'lucide-react';
import { CountryCodeSelect } from '@/components/ui/CountryCodeSelect';
import { resolveSrc } from '@/utils/url';
import { getDoctorBySlug, DoctorDetailDto, fetchDoctorAvailability, createAppointment, fetchPaymentSettings, PaymentSettings } from '@/controllers/api';
import Skeleton from '@/components/ui/Skeleton';

const DoctorProfile: React.FC = () => {
  const { slug } = useParams();
  const [detail, setDetail] = useState<DoctorDetailDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+977');
  const [appointmentType, setAppointmentType] = useState('In-Clinic');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [bookingStep, setBookingStep] = useState<'details' | 'payment'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'clinic' | 'esewa' | 'khalti' | 'fonepay' | 'stripe'>('clinic');
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);

  const today = useMemo(() => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }, []);
  
  const maxDay = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }, []);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    
    // Fetch payment settings
    fetchPaymentSettings()
      .then(settings => {
        if (!ignore) setPaymentSettings(settings);
      })
      .catch(console.error);

    if (slug) {
      getDoctorBySlug(slug)
      .then((d) => {
        if (!ignore) {
          setDetail(d);
          if (d.appointment_type && d.appointment_type.length > 0) {
            setAppointmentType(d.appointment_type[0]);
          }
          setDate(today);
          setTime('');
          setSlotsLoading(true);
          fetchDoctorAvailability(d.id, today)
            .then((res) => { 
              const s = res.slots || []; 
              setSlots(s); 
              setTime(s.length > 0 ? s[0] : ''); 
            })
            .catch(() => { setSlots([]); setTime(''); })
            .finally(() => setSlotsLoading(false));
        } 
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    return () => { ignore = true; };
  }, [slug, today]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 h-48 lg:h-64 relative"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
                   <Skeleton className="w-40 h-40 rounded-2xl flex-shrink-0" />
                   <div className="flex-1 pt-2 w-full">
                      <Skeleton variant="text" height={36} className="w-1/2 mb-4" />
                      <Skeleton variant="text" height={24} className="w-1/3 mb-2" />
                      <Skeleton variant="text" height={24} className="w-1/4 mb-4" />
                      <Skeleton variant="text" height={20} className="w-2/3 mb-2" />
                      <Skeleton variant="text" height={20} className="w-1/2" />
                   </div>
               </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-6">
                  <Skeleton variant="text" height={24} className="w-1/2 mb-6" />
                  <div className="grid grid-cols-3 gap-2 mb-6">
                     <Skeleton height={40} className="rounded-lg" />
                     <Skeleton height={40} className="rounded-lg" />
                     <Skeleton height={40} className="rounded-lg" />
                  </div>
                  <Skeleton height={200} className="rounded-lg" />
              </div>
            </div>
         </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="text-rose-500 mb-2 font-bold text-lg">Unable to load profile</div>
        <div className="text-slate-600"><div dangerouslySetInnerHTML={{ __html: error }} /></div>
      </div>
    </div>
  );
  
  if (!detail) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 h-48 lg:h-64 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg bg-white relative z-10">
                    {detail.profile_photo_path || detail.profile_photo_url ? (
                      <img 
                        src={detail.profile_photo_path ? resolveSrc(detail.profile_photo_path) : (detail.profile_photo_url as string)} 
                        alt={detail.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <User className="w-16 h-16 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md z-20">
                    <ShieldCheck className="w-6 h-6 text-teal-500 fill-teal-50" />
                  </div>
                </div>
                
                <div className="flex-1 pt-2">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="text-3xl font-bold text-slate-900 tracking-tight mb-1" dangerouslySetInnerHTML={{ __html: detail.name }} />
                      
                      {detail.position && (
                        <div className="flex items-center gap-2 text-slate-600 font-medium text-base mb-1">
                          <Briefcase className="w-4 h-4 text-teal-500" />
                          <div dangerouslySetInnerHTML={{ __html: detail.position }} />
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-teal-600 font-medium text-base">
                        <Stethoscope className="w-4 h-4" />
                        <div dangerouslySetInnerHTML={{ __html: detail.specialization || 'General Practitioner' }} />
                      </div>

                      {(detail.hospitals?.length || detail.hospital_name) && (
                        <div className="flex items-center gap-2 text-slate-600 font-medium text-base mt-1">
                          <Building className="w-4 h-4 text-teal-500" />
                          <div>
                            <div dangerouslySetInnerHTML={{ __html: detail.hospitals && detail.hospitals.length > 0 ? detail.hospitals.join(', ') : detail.hospital_name }} />
                          </div>
                        </div>
                      )}

                      {detail.nmc_no && (
                        <div className="text-xs text-slate-400 font-mono uppercase tracking-wide mt-2 mb-2"><div dangerouslySetInnerHTML={{ __html: `NMC: ${detail.nmc_no}` }} /></div>
                      )}

                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <div dangerouslySetInnerHTML={{ __html: detail.experience_years ? `${detail.experience_years} Years Experience` : 'Experience not specified' }} />
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <div dangerouslySetInnerHTML={{ __html: detail.location || 'Location not specified' }} />
                        </div>
                        {/* Consultation Fees - Display based on available types */}
                        {(detail.consultation_fee_clinic || detail.consultation_fee_online || detail.consultation_fee_home) && (
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            {detail.consultation_fee_clinic && (
                                <div className="flex items-center gap-2 text-blue-900 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                  <Building className="w-3 h-3 text-brand-blue" />
                                  <div>Clinic: <div className="font-bold text-brand-blue inline" dangerouslySetInnerHTML={{ __html: `NPR ${detail.consultation_fee_clinic}` }} /></div>
                                </div>
                            )}
                            {detail.consultation_fee_online && (
                                <div className="flex items-center gap-2 text-blue-900 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                  <Video className="w-3 h-3 text-brand-blue" />
                                  <div>Online: <div className="font-bold text-brand-blue inline" dangerouslySetInnerHTML={{ __html: `NPR ${detail.consultation_fee_online}` }} /></div>
                                </div>
                            )}
                            {detail.consultation_fee_home && (
                                <div className="flex items-center gap-2 text-blue-900 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                  <Home className="w-3 h-3 text-brand-blue" />
                                  <div>Home: <div className="font-bold text-brand-blue inline" dangerouslySetInnerHTML={{ __html: `NPR ${detail.consultation_fee_home}` }} /></div>
                                </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {detail.is_active && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 uppercase tracking-wide border border-green-200">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                        <div dangerouslySetInnerHTML={{ __html: 'Active' }} />
                      </div>
                    )}
                  </div>

                  {(detail.hospitals?.length || detail.hospital_name) && (
                    <div className="mt-6">
                      <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 inline-flex pr-6">
                        <Building className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Hospitals</p>
                          <div className="font-medium" dangerouslySetInnerHTML={{ __html: detail.hospitals && detail.hospitals.length > 0 ? detail.hospitals.join(', ') : (detail.hospital_name || '') }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Journey */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                  <Activity className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Professional Journey</h2>
              </div>
              
              <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-headings:text-slate-800">
                {detail.content ? (
                  <div dangerouslySetInnerHTML={{ __html: detail.content }} />
                ) : (
                  <div className="text-slate-600">
                    <div dangerouslySetInnerHTML={{ __html: `${detail.name} is a dedicated ${detail.specialization || 'healthcare professional'} based in ${detail.location || 'our network'}.` }} />
                    <div dangerouslySetInnerHTML={{ __html: ` With over ${detail.experience_years ?? 0} years of clinical experience, Dr. ${detail.name.split(' ').pop()} is committed to providing patient-centered care and ensuring the best medical outcomes for all patients${(detail.hospitals?.length || detail.hospital_name) ? ` at ${detail.hospitals && detail.hospitals.length > 0 ? detail.hospitals.join(', ') : detail.hospital_name}` : ''}.` }} />
                  </div>
                )}
              </div>
            </div>
            
            {/* Reviews Placeholder (Could be added later) */}
            {/* <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
               <h2 className="text-xl font-bold text-slate-900 mb-4">Patient Reviews</h2>
               ...
            </div> */}
          </div>

          {/* Sidebar Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden sticky top-24">
              <div className="bg-slate-900 p-6 text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-400" />
                  Book Appointment
                </h2>
                <p className="text-slate-400 text-sm mt-1">Select a time slot that works for you</p>
              </div>
              
              <div className="p-6 space-y-6">
                {bookingStep === 'details' ? (
                  <>
                    {/* Appointment Type */}
                    {detail.appointment_type && detail.appointment_type.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Appointment Type</label>
                        <div className="grid grid-cols-2 gap-3">
                          {detail.appointment_type.map((type) => {
                              let label = type;
                              let Icon = Building;
                              if (type === 'Online') { label = 'Video Call'; Icon = Video; }
                              else if (type === 'Home Visit') { label = 'Home Visit'; Icon = Home; }
                              else if (type === 'In-Clinic') { label = 'In-Clinic'; Icon = Building; }
                              
                              return (
                                  <button
                                    key={type}
                                    type="button"
                                    onClick={() => setAppointmentType(type)}
                                    className={`
                                      flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border font-medium transition-all
                                      ${appointmentType === type
                                        ? 'bg-teal-50 border-teal-500 text-teal-700 ring-1 ring-teal-500'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}
                                    `}
                                  >
                                    <Icon className="w-4 h-4" />
                                    <span>{label}</span>
                                  </button>
                              );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Date Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Select Date</label>
                      <input
                        type="date"
                        value={date}
                        min={today}
                        max={maxDay}
                        onChange={async (e) => {
                          const val = e.target.value;
                          setDate(val);
                          setSlotsLoading(true);
                          try {
                            if (!detail) throw new Error('No doctor');
                            const res = await fetchDoctorAvailability(detail.id, val);
                            const s = res.slots || [];
                            setSlots(s);
                            setTime(s.length > 0 ? s[0] : '');
                          } catch {
                            setSlots([]);
                            setTime('');
                          } finally {
                            setSlotsLoading(false);
                          }
                        }}
                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    {/* Slots */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 flex justify-between">
                        <span>Available Slots</span>
                      </label>
                      
                      {slotsLoading ? (
                        <div className="grid grid-cols-3 gap-2">
                          {[...Array(9)].map((_, i) => (
                            <Skeleton key={i} height={38} className="rounded-lg" />
                          ))}
                        </div>
                      ) : slots.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                          <p className="text-slate-500 text-sm">No slots available for this date.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                          {slots.map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setTime(s)}
                              className={`
                                px-2 py-2 text-sm font-medium rounded-lg border transition-all
                                ${time === s 
                                  ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200' 
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-teal-50'}
                              `}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-100 my-4"></div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient Name</label>
                        <input 
                          value={patientName} 
                          onChange={e => setPatientName(e.target.value)} 
                          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" 
                          placeholder="Enter full name" 
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number</label>
                        <div className="flex gap-2">
                          <div className="w-[140px]">
                            <CountryCodeSelect
                              value={countryCode}
                              onChange={setCountryCode}
                            />
                          </div>
                          <input 
                            type="tel"
                            value={phone} 
                            onChange={e => setPhone(e.target.value)} 
                            className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" 
                            placeholder="Mobile number" 
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes (Optional)</label>
                        <textarea 
                          value={notes} 
                          onChange={e => setNotes(e.target.value)} 
                          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none" 
                          placeholder="Briefly describe your issue..." 
                          rows={3} 
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                     {/* Payment UI */}
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                        <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-2">Booking Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Doctor</span>
                            <span className="font-medium text-slate-900">{detail.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Date</span>
                            <span className="font-medium text-slate-900">{date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Time</span>
                            <span className="font-medium text-slate-900">{time}</span>
                          </div>
                          {(() => {
                            const fee = appointmentType === 'Online' ? detail.consultation_fee_online
                              : appointmentType === 'In-Clinic' ? detail.consultation_fee_clinic
                              : appointmentType === 'Home Visit' ? detail.consultation_fee_home
                              : null;
                            
                            if (fee) {
                              return (
                                <div className="flex justify-between pt-2 border-t border-slate-200">
                                  <span className="font-semibold text-slate-700">Consultation Fee</span>
                                  <span className="font-bold text-teal-600">NPR {fee}</span>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700">Select Payment Method</label>
                        <div className="grid grid-cols-1 gap-3">
                           {/* Payment Options */}
                           {/* Clinic */}
                           <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'clinic' ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                              <input type="radio" name="payment" value="clinic" checked={paymentMethod === 'clinic'} onChange={() => setPaymentMethod('clinic')} className="mr-3 accent-teal-600" />
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-700">Pay at Clinic</span>
                                <span className="text-xs text-slate-500">Pay cash/card when you visit</span>
                              </div>
                           </label>
                           
                           {/* eSewa */}
                           {paymentSettings?.esewa?.enabled && (
                             <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'esewa' ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                                <input type="radio" name="payment" value="esewa" checked={paymentMethod === 'esewa'} onChange={() => setPaymentMethod('esewa')} className="mr-3 accent-green-600" />
                                <div className="flex flex-col">
                                  <span className="font-medium text-slate-700">eSewa Mobile Wallet</span>
                                  <span className="text-xs text-slate-500">Instant payment via eSewa</span>
                                </div>
                             </label>
                           )}

                           {/* Khalti */}
                           {paymentSettings?.khalti?.enabled && (
                             <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'khalti' ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                                <input type="radio" name="payment" value="khalti" checked={paymentMethod === 'khalti'} onChange={() => setPaymentMethod('khalti')} className="mr-3 accent-purple-600" />
                                <div className="flex flex-col">
                                  <span className="font-medium text-slate-700">Khalti Digital Wallet</span>
                                  <span className="text-xs text-slate-500">Instant payment via Khalti</span>
                                </div>
                             </label>
                           )}

                           {/* Fonepay */}
                           {paymentSettings?.fonepay?.enabled && (
                             <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'fonepay' ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                                <input type="radio" name="payment" value="fonepay" checked={paymentMethod === 'fonepay'} onChange={() => setPaymentMethod('fonepay')} className="mr-3 accent-red-600" />
                                <div className="flex flex-col">
                                  <span className="font-medium text-slate-700">Fonepay</span>
                                  <span className="text-xs text-slate-500">Instant payment via Fonepay</span>
                                </div>
                             </label>
                           )}

                           {/* Stripe */}
                           {paymentSettings?.stripe?.enabled && (
                             <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'stripe' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                                <input type="radio" name="payment" value="stripe" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} className="mr-3 accent-indigo-600" />
                                <div className="flex flex-col">
                                  <span className="font-medium text-slate-700">Stripe / Card</span>
                                  <span className="text-xs text-slate-500">Credit/Debit Card payment</span>
                                </div>
                             </label>
                           )}
                        </div>
                      </div>
                  </div>
                )}

                {/* Messages */}
                {actionError && (
                  <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> {actionError}
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100 flex items-center gap-2">
                     <ShieldCheck className="w-4 h-4" /> {successMsg}
                  </div>
                )}

                <div className="flex gap-3">
                  {bookingStep === 'payment' && (
                    <button
                      onClick={() => setBookingStep('details')}
                      className="px-4 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Back
                    </button>
                  )}

                  <button
                    className={`
                      flex-1 py-3.5 px-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95
                      ${(actionLoading || !patientName || !date || !time || !phone) 
                        ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                        : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-teal-500/30'}
                    `}
                    disabled={actionLoading || !patientName || !date || !time || !phone}
                    onClick={async () => {
                      setActionError(null);
                      if (!patientName || !date || !time || !phone) { setActionError('Please fill all fields'); return; }
                      
                      if (bookingStep === 'details') {
                        setBookingStep('payment');
                        if (appointmentType !== 'In-Clinic' && paymentMethod === 'clinic') {
                           if (paymentSettings?.esewa?.enabled) setPaymentMethod('esewa');
                           else if (paymentSettings?.khalti?.enabled) setPaymentMethod('khalti');
                           else if (paymentSettings?.fonepay?.enabled) setPaymentMethod('fonepay');
                           else if (paymentSettings?.stripe?.enabled) setPaymentMethod('stripe');
                           else {
                               setActionError("Online payment is required for this appointment type but no gateway is active.");
                               return;
                           }
                        }
                        return;
                      }

                      const scheduled = new Date(`${date}T${time}`);
                      const iso = scheduled.toISOString();
                      setActionLoading(true);
                      try {
                        await createAppointment({ 
                          patient_name: patientName, 
                          doctor_id: detail ? detail.id : 0, 
                          scheduled_at: iso, 
                          notes: `Payment: ${paymentMethod.toUpperCase()} | ${notes}`,
                          phone: `${countryCode} ${phone}`,
                          appointment_type: appointmentType
                        });
                        setSuccessMsg('Appointment requested successfully');
                        setPatientName(''); setNotes(''); setPhone('');
                        setBookingStep('details');
                        setPaymentMethod('clinic');
                      } catch (e: any) {
                        setActionError(e.message || 'Failed to book appointment');
                      } finally {
                        setActionLoading(false);
                      }
                    }}
                  >
                    {actionLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Processing...
                      </span>
                    ) : (bookingStep === 'details' ? 'Next' : 'Confirm & Book')}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
