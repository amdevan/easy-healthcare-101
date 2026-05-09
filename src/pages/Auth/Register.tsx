import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import GoogleLogo from '@/assets/icons/google.svg';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState<string>('+977');
  const [localPhone, setLocalPhone] = useState<string>('');
  const [countryQuery, setCountryQuery] = useState<string>('');
  const [showCountryDropdown, setShowCountryDropdown] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Country options with flags (initial seed; will be replaced by fetched full list)
  const [countries, setCountries] = useState<{ iso: string; dial: string; name: string; flag: string }[]>([
    { iso: 'US', dial: '+1', name: 'United States', flag: '🇺🇸' },
    { iso: 'CA', dial: '+1', name: 'Canada', flag: '🇨🇦' },
    { iso: 'GB', dial: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { iso: 'IN', dial: '+91', name: 'India', flag: '🇮🇳' },
    { iso: 'NP', dial: '+977', name: 'Nepal', flag: '🇳🇵' },
    { iso: 'AU', dial: '+61', name: 'Australia', flag: '🇦🇺' },
    { iso: 'DE', dial: '+49', name: 'Germany', flag: '🇩🇪' },
    { iso: 'FR', dial: '+33', name: 'France', flag: '🇫🇷' },
    { iso: 'SG', dial: '+65', name: 'Singapore', flag: '🇸🇬' },
    { iso: 'AE', dial: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
  ]);

  // Fetch full country list (flags + dial codes) from Rest Countries
  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=cca2,idd,flag,name', { signal: controller.signal });
        if (!res.ok) return; // keep seed list on failure
        const data: Array<{ cca2: string; idd: { root?: string; suffixes?: string[] }; flag: string; name: { common: string } }> = await res.json();
        const enriched = data
          .filter((c) => c.idd && c.idd.root)
          .map((c) => {
            const root = c.idd.root || '';
            const suffix = (c.idd.suffixes && c.idd.suffixes[0]) || '';
            return {
              iso: (c.cca2 || '').toUpperCase(),
              dial: `${root}${suffix}`,
              name: c.name?.common || c.cca2,
              flag: c.flag || '',
            };
          })
          .filter((c) => c.dial.startsWith('+'))
          .sort((a, b) => a.name.localeCompare(b.name));
        if (enriched.length) setCountries(enriched);
      } catch (err) {
        // Ignore abort errors and network failures; keep seed list
        if ((err as any)?.name === 'AbortError') return;
      }
    };
    run();
    return () => controller.abort();
  }, []);

  const validate = () => {
    const errs: string[] = [];
    if (!name.trim()) errs.push('Full name is required.');
    if (!email.trim()) errs.push('Email is required.');
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) errs.push('Enter a valid email address.');
    const sanitizedLocal = localPhone.replace(/\D/g, '');
    const fullPhone = `${countryCode}${sanitizedLocal}`;
    if (!sanitizedLocal) errs.push('Phone number is required.');
    else if (!/^\+\d{7,15}$/.test(fullPhone)) errs.push('Enter a valid phone number.');
    if (!password) errs.push('Password is required.');
    else if (password.length < 8) errs.push('Password must be at least 8 characters.');
    if (confirm !== password) errs.push('Passwords do not match.');
    if (!acceptTerms) errs.push('You must accept the Terms & Privacy.');
    if (errs.length) {
      setError(errs.join(' '));
      return false;
    }
    setPhone(fullPhone);
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    
    // Recalculate phone just in case
    const sanitizedLocal = localPhone.replace(/\D/g, '');
    const fullPhone = `${countryCode}${sanitizedLocal}`;

    try {
      await register({
        name,
        email,
        password,
        password_confirmation: confirm,
        phone: fullPhone
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    // Placeholder for real OAuth flow
    setError('Social login not implemented yet.');
  };

  return (
    <section className="bg-brand-gray-100">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Visual / Intro panel */}
          <div className="hidden lg:block">
            <div className="relative h-full min-h-[480px] rounded-2xl overflow-hidden bg-brand-blue">
              <div className="absolute inset-0 bg-brand-blue/80" />
              <img
                src="https://picsum.photos/1000/800?healthcare"
                alt="Healthy lifestyle"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="relative z-10 p-10 text-white space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-2xl font-bold tracking-tight">Join Easy Healthcare</span>
                </div>
                <h2 className="text-4xl font-extrabold leading-tight">
                  Create your account,
                  <br />
                  <span className="text-blue-100">start your care journey.</span>
                </h2>
                <p className="text-blue-50 max-w-md">
                  Access appointments, test results, and personalized health tools in one secure place.
                </p>
              </div>
            </div>
          </div>

          {/* Register form */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-extrabold text-brand-gray-900">Create an account</h1>
                <p className="mt-2 text-brand-gray-600">Fill in your details below to get started.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-sm font-medium text-brand-gray-700">Full name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-lg border border-brand-gray-300 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 px-4 py-2.5 text-brand-gray-900 placeholder-brand-gray-400 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-sm font-medium text-brand-gray-700">Phone number</label>
                  <div className="flex gap-2">
                    <div className="relative w-44">
                      <button
                        type="button"
                        aria-haspopup="listbox"
                        aria-expanded={showCountryDropdown}
                        onClick={() => setShowCountryDropdown((v) => !v)}
                        className="flex w-full items-center justify-between rounded-lg border border-brand-gray-300 bg-white px-3 py-2.5 text-sm text-brand-gray-900 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 outline-none"
                      >
                        <span className="flex items-center gap-2 truncate">
                          {(countries.find((c) => c.dial === countryCode)?.flag) ?? ''}
                          <span className="text-brand-gray-800">{countryCode}</span>
                        </span>
                        <span className="ml-2 text-brand-gray-400">▾</span>
                      </button>
                      {showCountryDropdown && (
                        <div className="absolute z-20 mt-1 w-full rounded-lg border border-brand-gray-200 bg-white shadow-lg">
                          <input
                            type="text"
                            value={countryQuery}
                            onChange={(e) => setCountryQuery(e.target.value)}
                            placeholder="Search country or code"
                            className="w-full border-b border-brand-gray-200 px-3 py-2 text-sm text-brand-gray-900 placeholder-brand-gray-400 focus:outline-none"
                          />
                          <ul role="listbox" className="max-h-60 overflow-auto py-1">
                            {countries
                              .filter((c) => {
                                const q = countryQuery.trim().toLowerCase();
                                if (!q) return true;
                                return (
                                  c.name.toLowerCase().includes(q) ||
                                  c.iso.toLowerCase().includes(q) ||
                                  c.dial.toLowerCase().includes(q)
                                );
                              })
                              .map((c) => (
                                <li key={c.iso}>
                                  <button
                                    type="button"
                                    role="option"
                                    aria-selected={c.dial === countryCode}
                                    onClick={() => {
                                      setCountryCode(c.dial);
                                      setShowCountryDropdown(false);
                                      setCountryQuery('');
                                    }}
                                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-brand-gray-50 ${
                                      c.dial === countryCode ? 'bg-brand-gray-100' : ''
                                    }`}
                                  >
                                    <span className="flex items-center gap-2 truncate">
                                      <span>{c.flag}</span>
                                      <span className="text-brand-gray-900">{c.name}</span>
                                    </span>
                                    <span className="ml-2 text-brand-gray-500">{c.dial}</span>
                                  </button>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="e.g. 9812345678"
                      value={localPhone}
                      onChange={(e) => setLocalPhone(e.target.value)}
                      className="block w-full rounded-lg border border-brand-gray-300 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 px-4 py-2.5 text-brand-gray-900 placeholder-brand-gray-400 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-sm font-medium text-brand-gray-700">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-brand-gray-300 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 px-4 py-2.5 text-brand-gray-900 placeholder-brand-gray-400 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-brand-gray-700">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-brand-gray-300 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 px-4 py-2.5 text-brand-gray-900 placeholder-brand-gray-400 outline-none"
                  />
                  <p className="text-xs text-brand-gray-500">Must be at least 8 characters.</p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="confirm" className="block text-sm font-medium text-brand-gray-700">Confirm password</label>
                  <input
                    id="confirm"
                    name="confirm"
                    type="password"
                    placeholder="Repeat password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="block w-full rounded-lg border border-brand-gray-300 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 px-4 py-2.5 text-brand-gray-900 placeholder-brand-gray-400 outline-none"
                  />
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="h-4 w-4 rounded border-brand-gray-300 text-brand-blue focus:ring-brand-blue/20"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-brand-gray-600">
                      I agree to the <Link to="/terms" className="font-medium text-brand-blue hover:text-brand-blue/80">Terms of Service</Link> and <Link to="/privacy" className="font-medium text-brand-blue hover:text-brand-blue/80">Privacy Policy</Link>.
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center py-3 text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-brand-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-brand-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-brand-gray-700 hover:bg-brand-gray-50 focus:outline-none focus:ring-4 focus:ring-brand-gray-100"
                  >
                    <img src={GoogleLogo} alt="Google" className="h-5 w-5" />
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('apple')}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-brand-gray-700 hover:bg-brand-gray-50 focus:outline-none focus:ring-4 focus:ring-brand-gray-100"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    <span>GitHub</span>
                  </button>
                </div>

                <p className="mt-6 text-center text-sm text-brand-gray-600">
                  Already have an account?{' '}
                  <Link to="/auth/login" className="font-semibold text-brand-blue hover:text-brand-blue/80">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
