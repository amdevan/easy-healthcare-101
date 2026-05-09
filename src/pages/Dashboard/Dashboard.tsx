import React, { useEffect, useMemo, useState } from 'react';
import { LayoutDashboard, User as UserIcon, Calendar, FileText, FlaskConical, LogOut, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { cancelMyAppointment, fetchMyAppointments, fetchMyLabAppointments, fetchMyPrescriptions, fetchMyProfile, updateMyProfile, type MyProfileResponse } from '@/controllers/api';
import { resolveSrc } from '@/utils/url';

type TabKey = 'overview' | 'profile' | 'appointments' | 'prescriptions' | 'labs';

const formatDateTime = (value?: string | null) => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
};

const Dashboard: React.FC = () => {
  const { token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const [profile, setProfile] = useState<MyProfileResponse | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [appointments, setAppointments] = useState<any | null>(null);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(null);

  const [prescriptions, setPrescriptions] = useState<any | null>(null);
  const [prescriptionsLoading, setPrescriptionsLoading] = useState(false);
  const [prescriptionsError, setPrescriptionsError] = useState<string | null>(null);

  const [labs, setLabs] = useState<any | null>(null);
  const [labsLoading, setLabsLoading] = useState(false);
  const [labsError, setLabsError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    dob: '',
    gender: '',
    blood_type: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const tabs = useMemo(
    () =>
      [
        { key: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
        { key: 'profile' as const, label: 'My Profile', icon: UserIcon },
        { key: 'appointments' as const, label: 'Appointments', icon: Calendar },
        { key: 'prescriptions' as const, label: 'Prescriptions', icon: FileText },
        { key: 'labs' as const, label: 'Lab Appointments', icon: FlaskConical },
      ] as const,
    []
  );

  const loadProfile = async () => {
    if (!token) return;
    setProfileLoading(true);
    setProfileError(null);
    try {
      const data = await fetchMyProfile(token);
      setProfile(data);
      setForm({
        name: data.user?.name ?? data.patient?.name ?? '',
        phone: data.patient?.phone ?? '',
        address: data.patient?.address ?? '',
        dob: data.patient?.dob ? String(data.patient.dob).slice(0, 10) : '',
        gender: data.patient?.gender ?? '',
        blood_type: data.patient?.blood_type ?? '',
      });
    } catch (e: any) {
      setProfileError(e?.message || 'Failed to load profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const loadAppointments = async () => {
    if (!token) return;
    setAppointmentsLoading(true);
    setAppointmentsError(null);
    try {
      const data = await fetchMyAppointments(token);
      setAppointments(data);
    } catch (e: any) {
      setAppointmentsError(e?.message || 'Failed to load appointments.');
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const loadPrescriptions = async () => {
    if (!token) return;
    setPrescriptionsLoading(true);
    setPrescriptionsError(null);
    try {
      const data = await fetchMyPrescriptions(token);
      setPrescriptions(data);
    } catch (e: any) {
      setPrescriptionsError(e?.message || 'Failed to load prescriptions.');
    } finally {
      setPrescriptionsLoading(false);
    }
  };

  const loadLabs = async () => {
    if (!token) return;
    setLabsLoading(true);
    setLabsError(null);
    try {
      const data = await fetchMyLabAppointments(token);
      setLabs(data);
    } catch (e: any) {
      setLabsError(e?.message || 'Failed to load lab appointments.');
    } finally {
      setLabsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    if (activeTab === 'appointments' && !appointments && !appointmentsLoading) loadAppointments();
    if (activeTab === 'prescriptions' && !prescriptions && !prescriptionsLoading) loadPrescriptions();
    if (activeTab === 'labs' && !labs && !labsLoading) loadLabs();
  }, [activeTab, token]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSavingProfile(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      const payload: any = {
        name: form.name || undefined,
        phone: form.phone || null,
        address: form.address || null,
        dob: form.dob || null,
        gender: form.gender || null,
        blood_type: form.blood_type || null,
      };
      const res = await updateMyProfile(token, payload);
      setProfile(res);
      setSaveSuccess('Profile updated.');
    } catch (e: any) {
      setSaveError(e?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelAppointment = async (id: number | string) => {
    if (!token) return;
    try {
      const updated = await cancelMyAppointment(token, id);
      setAppointments((prev: any) => {
        if (!prev?.data) return prev;
        const next = prev.data.map((a: any) => (String(a.id) === String(id) ? updated : a));
        return { ...prev, data: next };
      });
    } catch (e: any) {
      setAppointmentsError(e?.message || 'Failed to cancel appointment.');
    }
  };

  const patientName = profile?.user?.name || profile?.patient?.name || 'Patient';
  const patientEmail = profile?.user?.email || profile?.patient?.email || '-';

  const stats = useMemo(() => {
    const a = appointments?.total ?? appointments?.data?.length ?? 0;
    const p = prescriptions?.total ?? prescriptions?.data?.length ?? 0;
    const l = labs?.total ?? labs?.data?.length ?? 0;
    return { a, p, l };
  }, [appointments, prescriptions, labs]);

  return (
    <section className="py-10 lg:py-16 bg-brand-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-gray-900">Patient Panel</h1>
            <div className="mt-2 text-brand-gray-600">
              <span className="font-semibold text-brand-gray-800">{patientName}</span>
              <span className="mx-2 text-brand-gray-400">•</span>
              <span>{patientEmail}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="subtle" onClick={loadProfile} disabled={profileLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${profileLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-3">
              <div className="flex flex-col">
                {tabs.map((t) => {
                  const Icon = t.icon;
                  const active = t.key === activeTab;
                  return (
                    <button
                      key={t.key}
                      onClick={() => setActiveTab(t.key)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                        active ? 'bg-blue-50 text-brand-blue font-semibold' : 'text-brand-gray-700 hover:bg-brand-gray-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${active ? 'text-brand-blue' : 'text-brand-gray-400'}`} />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-9">
            {profileError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                {profileError}
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="text-sm text-brand-gray-500">Appointments</div>
                    <div className="mt-2 text-3xl font-extrabold text-brand-gray-900">{stats.a}</div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" onClick={() => setActiveTab('appointments')}>
                        View
                      </Button>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="text-sm text-brand-gray-500">Prescriptions</div>
                    <div className="mt-2 text-3xl font-extrabold text-brand-gray-900">{stats.p}</div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" onClick={() => setActiveTab('prescriptions')}>
                        View
                      </Button>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="text-sm text-brand-gray-500">Lab Appointments</div>
                    <div className="mt-2 text-3xl font-extrabold text-brand-gray-900">{stats.l}</div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" onClick={() => setActiveTab('labs')}>
                        View
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="text-xl font-bold text-brand-gray-900">Quick Info</div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-brand-gray-500">Phone</div>
                      <div className="mt-1 text-brand-gray-900">{profile?.patient?.phone || '-'}</div>
                    </div>
                    <div>
                      <div className="text-brand-gray-500">Address</div>
                      <div className="mt-1 text-brand-gray-900">{profile?.patient?.address || '-'}</div>
                    </div>
                    <div>
                      <div className="text-brand-gray-500">Date of birth</div>
                      <div className="mt-1 text-brand-gray-900">{profile?.patient?.dob ? String(profile.patient.dob).slice(0, 10) : '-'}</div>
                    </div>
                    <div>
                      <div className="text-brand-gray-500">Blood type</div>
                      <div className="mt-1 text-brand-gray-900">{profile?.patient?.blood_type || '-'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="text-xl font-bold text-brand-gray-900">My Profile</div>

                {(saveError || saveSuccess) && (
                  <div
                    className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                      saveError ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {saveError || saveSuccess}
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-gray-700">Full name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className="mt-1 block w-full rounded-lg border border-brand-gray-300 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 px-4 py-2.5 text-brand-gray-900 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-gray-700">Phone</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      className="mt-1 block w-full rounded-lg border border-brand-gray-300 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 px-4 py-2.5 text-brand-gray-900 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand-gray-700">Address</label>
                    <input
                      value={form.address}
                      onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                      className="mt-1 block w-full rounded-lg border border-brand-gray-300 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 px-4 py-2.5 text-brand-gray-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-gray-700">Date of birth</label>
                    <input
                      type="date"
                      value={form.dob}
                      onChange={(e) => setForm((p) => ({ ...p, dob: e.target.value }))}
                      className="mt-1 block w-full rounded-lg border border-brand-gray-300 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 px-4 py-2.5 text-brand-gray-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-gray-700">Gender</label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
                      className="mt-1 block w-full rounded-lg border border-brand-gray-300 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 px-4 py-2.5 text-brand-gray-900 outline-none"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-gray-700">Blood type</label>
                    <input
                      value={form.blood_type}
                      onChange={(e) => setForm((p) => ({ ...p, blood_type: e.target.value }))}
                      className="mt-1 block w-full rounded-lg border border-brand-gray-300 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 px-4 py-2.5 text-brand-gray-900 outline-none"
                      placeholder="e.g. O+"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                    <Button variant="subtle" type="button" onClick={loadProfile} disabled={profileLoading || savingProfile}>
                      Reset
                    </Button>
                    <Button type="submit" disabled={savingProfile}>
                      {savingProfile ? 'Saving…' : 'Save changes'}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xl font-bold text-brand-gray-900">Appointments</div>
                  <Button variant="subtle" onClick={loadAppointments} disabled={appointmentsLoading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${appointmentsLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                {appointmentsError && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {appointmentsError}
                  </div>
                )}
                <div className="mt-6 space-y-3">
                  {(appointments?.data || []).length === 0 && !appointmentsLoading && (
                    <div className="text-brand-gray-600">No appointments yet.</div>
                  )}
                  {(appointments?.data || []).map((a: any) => (
                    <div key={a.id} className="rounded-xl border border-brand-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <div className="font-semibold text-brand-gray-900">
                          {a.doctor?.name ? `Dr. ${a.doctor.name}` : 'Appointment'}
                        </div>
                        <div className="mt-1 text-sm text-brand-gray-600">
                          {formatDateTime(a.scheduled_at)} <span className="mx-2 text-brand-gray-300">•</span> {a.status || '-'}
                        </div>
                        {a.notes && <div className="mt-2 text-sm text-brand-gray-600">{a.notes}</div>}
                      </div>
                      <div className="flex items-center gap-2">
                        {a.status !== 'completed' && a.status !== 'cancelled' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelAppointment(a.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xl font-bold text-brand-gray-900">Prescriptions</div>
                  <Button variant="subtle" onClick={loadPrescriptions} disabled={prescriptionsLoading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${prescriptionsLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                {prescriptionsError && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {prescriptionsError}
                  </div>
                )}
                <div className="mt-6 space-y-3">
                  {(prescriptions?.data || []).length === 0 && !prescriptionsLoading && (
                    <div className="text-brand-gray-600">No prescriptions yet.</div>
                  )}
                  {(prescriptions?.data || []).map((p: any) => (
                    <div key={p.id} className="rounded-xl border border-brand-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <div className="font-semibold text-brand-gray-900">
                          {p.doctor?.name ? `Dr. ${p.doctor.name}` : 'Prescription'}
                        </div>
                        <div className="mt-1 text-sm text-brand-gray-600">
                          {formatDateTime(p.prescribed_at || p.created_at)}
                        </div>
                        {p.notes && <div className="mt-2 text-sm text-brand-gray-600">{p.notes}</div>}
                      </div>
                      <div className="flex items-center gap-2">
                        {p.file_path && (
                          <Button
                            variant="outline"
                            size="sm"
                            href={resolveSrc(p.file_path)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'labs' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xl font-bold text-brand-gray-900">Lab Appointments</div>
                  <Button variant="subtle" onClick={loadLabs} disabled={labsLoading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${labsLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                {labsError && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {labsError}
                  </div>
                )}
                <div className="mt-6 space-y-3">
                  {(labs?.data || []).length === 0 && !labsLoading && (
                    <div className="text-brand-gray-600">No lab appointments yet.</div>
                  )}
                  {(labs?.data || []).map((l: any) => (
                    <div key={l.id} className="rounded-xl border border-brand-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <div className="font-semibold text-brand-gray-900">{l.lab_test?.name || l.test_name || 'Lab Test'}</div>
                        <div className="mt-1 text-sm text-brand-gray-600">
                          {formatDateTime(l.scheduled_at)} <span className="mx-2 text-brand-gray-300">•</span> {l.status || '-'}
                        </div>
                        {l.home_collection && <div className="mt-2 text-sm text-brand-gray-600">Home collection</div>}
                        {l.address && <div className="mt-1 text-sm text-brand-gray-600">{l.address}</div>}
                      </div>
                      <div className="flex items-center gap-2">
                        {l.report_file && (
                          <Button
                            variant="outline"
                            size="sm"
                            href={resolveSrc(l.report_file)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View report
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
