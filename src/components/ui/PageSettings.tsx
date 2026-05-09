import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAdmin } from '@/context/AdminContext';
import { getSlugFromPath } from '@/utils/pageMapping';
import { usePageContent } from '@/hooks/usePageContent';
import { updatePage } from '@/controllers/adminController'; // Ensure this is exported
import { Settings, X, Save, AlertTriangle } from 'lucide-react';

const PageSettings: React.FC = () => {
    const { isAdminMode } = useAdmin();
    const location = useLocation();
    const slug = getSlugFromPath(location.pathname);

    // Only fetch if admin and valid slug
    const { data: pageData, loading: pageLoading } = usePageContent(isAdminMode && slug ? slug : '');

    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        seo_title: '',
        seo_description: '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [msg, setMsg] = useState<string | null>(null);

    useEffect(() => {
        if (pageData) {
            setFormData({
                title: pageData.title || '',
                slug: pageData.slug || '',
                seo_title: pageData.seo_title || '',
                seo_description: pageData.seo_description || '',
            });
        }
    }, [pageData]);

    if (!isAdminMode || !slug || !pageData) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setMsg(null);

        try {
            await updatePage(pageData.id, formData);
            setMsg('Page updated successfully.');
            if (formData.slug !== slug) {
                setMsg('Slug changed! Please refresh or navigate to the new URL.');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update page.');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 left-20 z-50 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                title="Page Settings"
            >
                <Settings className="w-5 h-5" />
                <span className="text-sm font-bold">Page Setup</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative animate-fade-in-up max-h-[90vh] overflow-y-auto">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-brand-blue" />
                    Page Settings
                </h2>
                <p className="text-sm text-gray-500 mb-6">Edit metadata for this page.</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                        {error}
                    </div>
                )}

                {msg && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                        {msg}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Page Name</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all outline-none"
                            placeholder="e.g. Contact Us"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Page URL</label>
                        <div className="flex items-center">
                            <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3 py-2 text-gray-500 text-sm select-none">
                                /
                            </span>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full border border-gray-300 rounded-r-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all outline-none"
                                placeholder="e.g. contact-us"
                            />
                        </div>
                        <p className="text-xs text-amber-600 mt-1 flex items-start gap-1">
                            <AlertTriangle className="w-3 h-3 mt-0.5" />
                            Start with cautionary checking: Changing this may break hardcoded links.
                        </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 mb-3">SEO / Meta Data</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">SEO Title</label>
                                <input
                                    type="text"
                                    value={formData.seo_title}
                                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all outline-none"
                                    placeholder="Page title for search engines"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">SEO Description</label>
                                <textarea
                                    value={formData.seo_description}
                                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all outline-none"
                                    placeholder="Brief description for search results..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-brand-blue text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PageSettings;
