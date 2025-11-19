import React, { useMemo, useState } from 'react';
import Editable from '@/components/ui/Editable';
import Button from '@/components/ui/Button';
import { submitContact } from '@/controllers/api';

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof ContactFormState, string>>;

const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactFormState>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<null | { message: string }>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (state: ContactFormState): FieldErrors => {
    const e: FieldErrors = {};
    if (!state.name.trim()) e.name = 'Please enter your full name.';
    if (!state.email.trim()) e.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) e.email = 'Please enter a valid email.';
    if (!state.subject.trim()) e.subject = 'Please add a subject.';
    if (!state.message.trim()) e.message = 'Please write a message.';
    if (state.phone && state.phone.length > 20) e.phone = 'Phone number seems too long.';
    return e;
  };

  const isValid = useMemo(() => Object.keys(validate(form)).length === 0, [form]);

  const handleChange = (field: keyof ContactFormState) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: ev.target.value }));
    // live-validate on change
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const currentErrors = validate(form);
    setErrors(currentErrors);
    setSubmitError(null);
    setSubmitted(null);
    if (Object.keys(currentErrors).length > 0) return;
    setSubmitting(true);
    try {
      const res = await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setSubmitted(res);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-12 lg:py-20 bg-brand-gray-100">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <Editable tag="h1" id="contact-title" className="text-3xl md:text-4xl font-extrabold text-brand-gray-900">Contact Us</Editable>
          <Editable tag="p" id="contact-desc" className="mt-4 text-brand-gray-600">
            Have questions? Reach out to our support team at <a href="mailto:support@easyhealthcare101.com" className="text-brand-blue underline">support@easyhealthcare101.com</a> or send us a message below.
          </Editable>

          <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6" noValidate>
            <div className="md:col-span-1">
              <label htmlFor="name" className="block text-sm font-medium text-brand-gray-700">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className="mt-1 w-full rounded-lg border border-brand-gray-300 bg-brand-gray-50 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="Jane Doe"
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="md:col-span-1">
              <label htmlFor="email" className="block text-sm font-medium text-brand-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="mt-1 w-full rounded-lg border border-brand-gray-300 bg-brand-gray-50 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="jane@example.com"
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="md:col-span-1">
              <label htmlFor="phone" className="block text-sm font-medium text-brand-gray-700">Phone (optional)</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange('phone')}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                className="mt-1 w-full rounded-lg border border-brand-gray-300 bg-brand-gray-50 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="(555) 123-4567"
              />
              {errors.phone && (
                <p id="phone-error" className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div className="md:col-span-1">
              <label htmlFor="subject" className="block text-sm font-medium text-brand-gray-700">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange('subject')}
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? 'subject-error' : undefined}
                className="mt-1 w-full rounded-lg border border-brand-gray-300 bg-brand-gray-50 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="How can we help?"
              />
              {errors.subject && (
                <p id="subject-error" className="mt-1 text-sm text-red-600">{errors.subject}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="message" className="block text-sm font-medium text-brand-gray-700">Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange('message')}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
                rows={5}
                className="mt-1 w-full rounded-lg border border-brand-gray-300 bg-brand-gray-50 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="Share any details you'd like us to know..."
              />
              {errors.message && (
                <p id="message-error" className="mt-1 text-sm text-red-600">{errors.message}</p>
              )}
            </div>

            <div className="md:col-span-2 flex items-center gap-3">
              <Button type="submit" variant="primary" disabled={submitting || !isValid} aria-label="Submit contact form">
                {submitting ? 'Sending…' : 'Send Message'}
              </Button>
              {submitted && (
                <span className="text-sm text-green-700">{submitted.message}</span>
              )}
              {submitError && (
                <span className="text-sm text-red-600">{submitError}</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;