import React, { useState, useRef, useEffect, useMemo } from 'react';
import { BookingFormData, VehicleItem, PricingTier } from '../types';
import { VEHICLES as DEFAULT_VEHICLES } from '../constants';
import { CountryCodeSelect } from '../../../components/ui/CountryCodeSelect';
import { Calendar, Clock, MapPin, User, Phone, ChevronRight, ChevronLeft, CheckCircle, Navigation, Loader2, Map as MapIcon, X } from 'lucide-react';

interface BookingFormProps {
  title?: string;
  subtitle?: string;
  steps?: {
    journey: string;
    vehicle: string;
    pricing?: string;
    details: string;
  };
  labels?: {
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    patientName: string;
    contactNumber: string;
    notes: string;
    vehicleSelect: string;
    pricingSelect?: string;
    patientDetails: string;
  };
  placeholders?: {
    pickup: string;
    dropoff: string;
    notes: string;
    patientName: string;
    contactNumber: string;
  };
  success?: {
    title: string;
    messageTemplate: string;
    contactTemplate: string;
    buttonText: string;
  };
  vehicles?: VehicleItem[];
  pricingTiers?: PricingTier[];
}

const BookingForm: React.FC<BookingFormProps> = ({
  title = "Book a Vehicle in 3 Easy Steps",
  subtitle = "We'll handle the logistics so you can focus on health.",
  steps = {
    journey: 'Journey',
    vehicle: 'Vehicle',
    details: 'Details'
  },
  labels = {
    pickup: 'Pickup Location',
    dropoff: 'Drop-off Destination',
    date: 'Date',
    time: 'Preferred Time',
    patientName: 'Patient Name',
    contactNumber: 'Contact Number',
    notes: 'Additional Notes',
    vehicleSelect: 'Select the right vehicle',
    patientDetails: 'Patient Details'
  },
  placeholders = {
    pickup: 'e.g. Home Address',
    dropoff: 'e.g. Norvic Hospital',
    notes: 'Any special medical requirements, assistance needs, or instructions',
    patientName: 'e.g. John Doe',
    contactNumber: 'e.g. 9800000000'
  },
  success = {
    title: 'Booking Request Sent!',
    messageTemplate: 'Thank you, {patientName}. Our dispatch team has received your request for {date} at {time}.',
    contactTemplate: 'We will call you at {contactNumber} shortly to confirm details and provide a final quote.',
    buttonText: 'Book another trip'
  },
  vehicles = DEFAULT_VEHICLES,
  pricingTiers = []
}) => {
  const mergedPlaceholders = {
    pickup: placeholders?.pickup || 'e.g. Home Address',
    dropoff: placeholders?.dropoff || 'e.g. Norvic Hospital',
    notes: placeholders?.notes || 'Any special medical requirements, assistance needs, or instructions',
    patientName: placeholders?.patientName || 'e.g. John Doe',
    contactNumber: placeholders?.contactNumber || 'e.g. 9800000000'
  };

  const mergedLabels = {
    pickup: labels?.pickup || 'Pickup Location',
    dropoff: labels?.dropoff || 'Drop-off Destination',
    date: labels?.date || 'Date',
    time: labels?.time || 'Preferred Time',
    patientName: labels?.patientName || 'Patient Name',
    contactNumber: labels?.contactNumber || 'Contact Number',
    notes: labels?.notes || 'Additional Notes',
    vehicleSelect: labels?.vehicleSelect || 'Select the right vehicle',
    pricingSelect: labels?.pricingSelect || 'Select a Pricing Plan',
    patientDetails: labels?.patientDetails || 'Patient Details'
  };

  const mergedSteps = {
        journey: steps?.journey || 'Journey',
        vehicle: steps?.vehicle || 'Vehicle',
        pricing: steps?.pricing || 'Pricing',
        details: steps?.details || 'Details'
    };

    const hasPricing = pricingTiers && pricingTiers.length > 0;
    const totalSteps = hasPricing ? 4 : 3;

    const availableVehicles = useMemo(() => {
        return vehicles.filter(v => {
            const btnText = (v.button_text || '').toLowerCase();
            const btnUrl = v.button_url || '#booking';
            const isComingSoon = btnText.includes('coming soon');
            const isExternalLink = btnUrl !== '#booking';
            return !isComingSoon && !isExternalLink;
        });
    }, [vehicles]);

    const defaultSuccess = {
        title: 'Booking Request Sent!',
        messageTemplate: 'Thank you, {patientName}. Our dispatch team has received your request for {date} at {time}.',
        contactTemplate: 'We will call you at {contactNumber} shortly to confirm details and provide a final quote.',
        buttonText: 'Book another trip'
    };

    const mergedSuccess = {
        title: success?.title || defaultSuccess.title,
        messageTemplate: success?.messageTemplate || defaultSuccess.messageTemplate,
        contactTemplate: success?.contactTemplate || defaultSuccess.contactTemplate,
        buttonText: success?.buttonText || defaultSuccess.buttonText
    };

    const [step, setStep] = useState(1);
  const [countryCode, setCountryCode] = useState('+977');
  const [formData, setFormData] = useState<BookingFormData>({
    patientName: '',
    contactNumber: '',
    pickupLocation: '',
    dropoffLocation: '',
    date: '',
    time: '',
    vehicleType: '',
    pricingTier: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Map State
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [activeField, setActiveField] = useState<'pickup' | 'dropoff' | null>(null);
  const [mapLoading, setMapLoading] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectVehicle = (id: string) => {
    setFormData(prev => ({ ...prev, vehicleType: id }));
  };

  const selectPricing = (id: string) => {
    setFormData(prev => ({ ...prev, pricingTier: id }));
  };

  const isStepValid = () => {
    if (step === 1) {
      return formData.pickupLocation && formData.dropoffLocation && formData.date && formData.time;
    }
    if (step === 2) {
      return formData.vehicleType;
    }
    if (step === 3 && hasPricing) {
      return formData.pricingTier;
    }
    return true;
  };

  const nextStep = () => {
    if (isStepValid()) setStep(prev => prev + 1);
  };
  const prevStep = () => setStep(prev => prev - 1);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const address = data.display_name;
          const formattedAddress = typeof address === 'string' ? address.replace(', Nepal', '') : `Current Location (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`;
          
          setFormData(prev => ({
            ...prev,
            pickupLocation: formattedAddress
          }));
        } catch (error) {
          console.error("Geocoding error:", error);
          setFormData(prev => ({
            ...prev,
            pickupLocation: `Current Location (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`
          }));
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please enter it manually.");
        setGettingLocation(false);
      }
    );
  };

  // Map Logic
  // Ensure Leaflet assets are available (CSS + JS via CDN)
  const ensureLeafletAssetsLoaded = (): Promise<void> => {
    return new Promise((resolve) => {
      const win = window as any;
      if (win.L) {
        resolve();
        return;
      }

      // Inject CSS if absent
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4QX7JQnUpn4GsxUuZa2Y4IitYEVrFZ1YF2zN8lH74g=';
        link.crossOrigin = '';
        document.head.appendChild(link);
      }

      // Inject JS if absent
      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kK8vZVaWZ8fT0+M=';
        script.crossOrigin = '';
        script.onload = () => resolve();
        document.body.appendChild(script);
      } else {
        resolve();
      }
    });
  };

  const openMap = async (field: 'pickup' | 'dropoff') => {
    setActiveField(field);
    setIsMapOpen(true);
    setMapLoading(true);
    await ensureLeafletAssetsLoaded();
    // Delay map initialization slightly to ensure modal is rendered
    setTimeout(() => initMap(), 100);
  };

  const initMap = () => {
    const L = (window as any).L;
    if (!L || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
    }

    // Default to Kathmandu
    const defaultLat = 27.7172;
    const defaultLng = 85.3240;
    
    const map = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;
    setMapLoading(false);

    // Add marker on click
    map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
        } else {
            markerRef.current = L.marker([lat, lng]).addTo(map);
        }
    });
  };

  const confirmMapLocation = async () => {
    if (!markerRef.current || !activeField) return;
    
    setMapLoading(true);
    const { lat, lng } = markerRef.current.getLatLng();
    
    try {
        // Simple reverse geocoding using OSM Nominatim (Free, no key required)
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        
        const address = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        // Use replace only if address is a string
        const formattedAddress = typeof address === 'string' ? address.replace(', Nepal', '') : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

        setFormData(prev => ({ ...prev, [activeField === 'pickup' ? 'pickupLocation' : 'dropoffLocation']: formattedAddress }));
        setIsMapOpen(false);
    } catch (error) {
        console.error("Geocoding error:", error);
        // Fallback to coordinates
        setFormData(prev => ({ ...prev, [activeField === 'pickup' ? 'pickupLocation' : 'dropoffLocation']: `${lat.toFixed(5)}, ${lng.toFixed(5)}` }));
        setIsMapOpen(false);
    } finally {
        setMapLoading(false);
        setActiveField(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
      // In a real app, you would send formData to your backend here
      console.log('Form Submitted:', formData);
    }, 1500);
  };

  if (submitted) {
    return (
      <section id="booking" className="py-24 bg-teal-50/50 scroll-mt-32">
        <div className="max-w-3xl mx-auto px-4">
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-teal-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-4" dangerouslySetInnerHTML={{ __html: mergedSuccess.title }} />
                <div className="text-lg text-slate-600 mb-8" dangerouslySetInnerHTML={{ __html: mergedSuccess.messageTemplate
                      .replace('{patientName}', formData.patientName)
                      .replace('{date}', formData.date)
                      .replace('{time}', formData.time) }} />
                <div className="text-slate-500 mb-8" dangerouslySetInnerHTML={{ __html: mergedSuccess.contactTemplate.replace('{contactNumber}', formData.contactNumber) }} />
                <button 
                onClick={() => {
                    setSubmitted(false);
                    setStep(1);
                    setFormData({
                        patientName: '',
                        contactNumber: '',
                        pickupLocation: '',
                        dropoffLocation: '',
                        date: '',
                        time: '',
                        vehicleType: '',
                        pricingTier: '',
                        notes: ''
                    });
                }}
                className="inline-flex items-center text-teal-600 hover:text-teal-800 font-semibold underline"
                >
                <div dangerouslySetInnerHTML={{ __html: mergedSuccess.buttonText }} />
                </button>
            </div>
        </div>
    </section>
    );
  }

  return (
    <section id="booking" className="py-24 bg-slate-900 text-white relative overflow-hidden scroll-mt-32">
      {/* Background decorative blobs */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-teal-900/20 rounded-l-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-blue-900/20 rounded-r-full blur-3xl"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <div className="text-3xl md:text-4xl font-bold text-white" dangerouslySetInnerHTML={{ __html: title }} />
          <div className="mt-3 text-slate-300" dangerouslySetInnerHTML={{ __html: subtitle }} />
        </div>

        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-700 -z-10 rounded"></div>
                
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((num) => {
                    let label = '';
                    if (num === 1) label = mergedSteps.journey;
                    else if (num === 2) label = mergedSteps.vehicle;
                    else if (num === 3 && hasPricing) label = mergedSteps.pricing;
                    else label = mergedSteps.details;

                    return (
                        <div key={num} className={`flex flex-col items-center ${step >= num ? 'text-teal-400' : 'text-slate-500'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= num ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/50' : 'bg-slate-800 border-2 border-slate-600'}`}>
                                {step > num ? <CheckCircle className="w-6 h-6" /> : num}
                            </div>
                            <div className="text-xs font-medium mt-2 bg-slate-900 px-2 rounded inline-block">
                                <div dangerouslySetInnerHTML={{ __html: label }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden text-slate-900 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            
            {/* Step 1: Journey Details */}
            {step === 1 && (
                <div className="p-8 md:p-12 animate-fadeIn">
                    <div className="text-2xl font-bold mb-6 flex items-center">
                        <MapPin className="mr-2 text-teal-600"/> 
                        <div dangerouslySetInnerHTML={{ __html: "Where are we going?" }} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <div className="block text-sm font-medium text-slate-700 mb-1">
                                    <div dangerouslySetInnerHTML={{ __html: mergedLabels.pickup }} />
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                    <input 
                                        type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange}
                                        placeholder={mergedPlaceholders.pickup}
                                        className="w-full pl-12 pr-20 p-4 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                    />
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                                        <button
                                            type="button"
                                            onClick={() => openMap('pickup')}
                                            className="text-slate-400 hover:text-teal-600 transition-colors p-2 rounded-full hover:bg-teal-50"
                                            title="Pick on Map"
                                        >
                                            <MapIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleGetCurrentLocation}
                                            disabled={gettingLocation}
                                            className="text-slate-400 hover:text-teal-600 transition-colors p-2 rounded-full hover:bg-teal-50"
                                            title="Use Current Location"
                                        >
                                            {gettingLocation ? (
                                                <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
                                            ) : (
                                                <Navigation className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="block text-sm font-medium text-slate-700 mb-1">
                                    <div dangerouslySetInnerHTML={{ __html: mergedLabels.dropoff }} />
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                    <input 
                                        type="text" name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange}
                                        placeholder={mergedPlaceholders.dropoff}
                                        className="w-full pl-12 pr-12 p-4 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                    />
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                         <button
                                            type="button"
                                            onClick={() => openMap('dropoff')}
                                            className="text-slate-400 hover:text-teal-600 transition-colors p-2 rounded-full hover:bg-teal-50"
                                            title="Pick on Map"
                                        >
                                            <MapIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="block text-sm font-medium text-slate-700 mb-1" dangerouslySetInnerHTML={{ __html: mergedLabels.date }} />
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                    <input 
                                        type="date" name="date" value={formData.date} onChange={handleChange}
                                        className="w-full pl-12 p-4 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="block text-sm font-medium text-slate-700 mb-1" dangerouslySetInnerHTML={{ __html: mergedLabels.time }} />
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                    <input 
                                        type="time" name="time" value={formData.time} onChange={handleChange}
                                        className="w-full pl-12 p-4 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Vehicle Selection */}
            {step === 2 && (
                <div className="p-8 md:p-12 animate-fadeIn">
                    <div className="text-2xl font-bold mb-6 text-center" dangerouslySetInnerHTML={{ __html: mergedLabels.vehicleSelect }} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {availableVehicles.map(v => (
                            <div 
                                key={v.id}
                                onClick={() => selectVehicle(v.id)}
                                className={`cursor-pointer rounded-2xl border-2 p-4 transition-all hover:shadow-lg ${formData.vehicleType === v.id ? 'border-teal-500 bg-teal-50' : 'border-slate-100 hover:border-teal-200'}`}
                            >
                                <div className="aspect-w-16 aspect-h-9 mb-3 rounded-xl overflow-hidden bg-slate-200">
                                    <img src={v.image} alt={v.name} className="w-full h-32 object-cover" />
                                </div>
                                <div className="flex justify-between items-start">
                                    <div className="font-bold text-slate-900" dangerouslySetInnerHTML={{ __html: v.name }} />
                                    {formData.vehicleType === v.id && <CheckCircle className="h-5 w-5 text-teal-600" />}
                                </div>
                                <div className="text-xs text-slate-500 mt-1" dangerouslySetInnerHTML={{ __html: v.description }} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 3: Pricing Selection (Optional) */}
            {step === 3 && hasPricing && (
                <div className="p-8 md:p-12 animate-fadeIn">
                    <div className="text-2xl font-bold mb-6 text-center" dangerouslySetInnerHTML={{ __html: mergedLabels.pricingSelect || 'Select Pricing Plan' }} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {pricingTiers?.map((tier, index) => {
                             const tierId = tier.service || `tier-${index}`;
                             return (
                                <div 
                                    key={index}
                                    onClick={() => selectPricing(tierId)}
                                    className={`cursor-pointer rounded-2xl border-2 p-4 transition-all hover:shadow-lg ${formData.pricingTier === tierId ? 'border-teal-500 bg-teal-50' : 'border-slate-100 hover:border-teal-200'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-slate-900" dangerouslySetInnerHTML={{ __html: tier.service }} />
                                        {formData.pricingTier === tierId && <CheckCircle className="h-5 w-5 text-teal-600" />}
                                    </div>
                                    <div className="text-2xl font-bold text-teal-600 mb-2" dangerouslySetInnerHTML={{ __html: String(typeof tier.price === 'number' ? `$${tier.price}` : tier.price) }} />
                                    <div className="text-sm text-slate-600 mb-3" dangerouslySetInnerHTML={{ __html: tier.details }} />
                                    {tier.features && (
                                        <ul className="space-y-1">
                                            {tier.features.slice(0, 3).map((feature, i) => (
                                                <li key={i} className="text-xs text-slate-500 flex items-center">
                                                    <CheckCircle className="h-3 w-3 mr-1 text-teal-500" />
                                                    <div dangerouslySetInnerHTML={{ __html: feature }} />
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                             );
                        })}
                    </div>
                </div>
            )}

            {/* Step 4 (or 3): Personal Details */}
            {step === totalSteps && (
                <div className="p-8 md:p-12 animate-fadeIn">
                    <div className="text-2xl font-bold mb-6 text-center" dangerouslySetInnerHTML={{ __html: mergedLabels.patientDetails }} />
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="block text-sm font-medium text-slate-700 mb-1" dangerouslySetInnerHTML={{ __html: mergedLabels.patientName }} />
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                    <input 
                                        type="text" name="patientName" value={formData.patientName} onChange={handleChange}
                                        placeholder={mergedPlaceholders.patientName}
                                        className="w-full pl-12 p-4 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="block text-sm font-medium text-slate-700 mb-1" dangerouslySetInnerHTML={{ __html: mergedLabels.contactNumber }} />
                                <div className="flex gap-2">
                                    <CountryCodeSelect
                                        value={countryCode}
                                        onChange={setCountryCode}
                                        className="w-[140px]"
                                    />
                                    <div className="relative flex-1">
                                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                        <input 
                                            type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange}
                                            placeholder={mergedPlaceholders.contactNumber}
                                            className="w-full pl-12 p-4 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="block text-sm font-medium text-slate-700 mb-1" dangerouslySetInnerHTML={{ __html: mergedLabels.notes }} />
                            <textarea 
                                name="notes" value={formData.notes} onChange={handleChange}
                                placeholder={mergedPlaceholders.notes}
                                className="w-full p-4 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none min-h-[120px]"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Footer: Navigation */}
            <div className="flex items-center justify-between p-6 bg-slate-50 border-t border-slate-100">
                <button 
                    type="button"
                    onClick={prevStep}
                    disabled={step === 1}
                    className={`inline-flex items-center px-4 py-2 rounded-xl border ${step === 1 ? 'border-slate-200 text-slate-300' : 'border-slate-300 text-slate-700 hover:bg-white hover:border-teal-300 hover:text-teal-700'} transition-colors`}
                >
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    Back
                </button>
                {step < totalSteps ? (
                    <button 
                        type="button"
                        onClick={nextStep}
                        className="inline-flex items-center px-6 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 shadow-sm"
                    >
                        Next
                        <ChevronRight className="h-5 w-5 ml-2" />
                    </button>
                ) : (
                    <div className="flex flex-col items-end gap-2">
                        {errorMessage && (
                            <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                                {errorMessage}
                            </div>
                        )}
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center px-6 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                            {isSubmitting ? <Loader2 className="h-5 w-5 ml-2 animate-spin" /> : <CheckCircle className="h-5 w-5 ml-2" />}
                        </button>
                    </div>
                )}
            </div>
          </form>
        </div>
      </div>

      {/* Map Modal */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h4 className="text-slate-900 font-bold">Select Location on Map</h4>
              <button 
                onClick={() => setIsMapOpen(false)} 
                className="p-2 rounded-full hover:bg-slate-100"
                aria-label="Close map"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <div className="h-96" ref={mapContainerRef}>
              {/* Leaflet map will mount here if available */}
              {mapLoading && (
                <div className="h-full w-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={confirmMapLocation} 
                className="inline-flex items-center px-4 py-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BookingForm;