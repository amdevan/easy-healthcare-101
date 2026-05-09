<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UiSetting;

class UiSettingSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['key' => 'general', 'value' => [
                'home_page_slug' => 'home',
            ]],
            ['key' => 'general', 'value' => []],
            ['key' => 'site.name', 'value' => ['text' => 'Easy Healthcare']],
            ['key' => 'site.tagline', 'value' => ['text' => 'Quality care, simplified']],
            ['key' => 'home.cta', 'value' => ['label' => 'Find Doctors', 'href' => '/find-doctors']],
            ['key' => 'home.slider', 'value' => [
                ['src' => 'https://images.unsplash.com/photo-1758691463384-771db2f192b3?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.1.0', 'alt' => 'Health care'],
                ['src' => 'https://plus.unsplash.com/premium_photo-1663013549676-1eba5ea1d16e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0', 'alt' => 'Medical tools and accessories'],
                ['src' => 'https://images.unsplash.com/photo-1758691462321-9b6c98c40f7e?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.1.0', 'alt' => 'Work desk with accessories'],
            ]],
            ['key' => 'home.diagnostics', 'value' => [
                'image' => 'https://images.unsplash.com/photo-1659353886973-ced1dfeab3ac?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0',
                'title' => 'Expand Your Practice. Offer Home Visits.',
                'subtitle' => 'Join our network of esteemed doctors providing compassionate care at patients\' homes.',
            ]],
            ['key' => 'home.download_app', 'value' => [
                'google_play_badge' => 'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png',
                'app_store_badge' => 'https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg',
            ]],
            ['key' => 'header', 'value' => [
                'top_bar' => [
                    'enabled' => true,
                    'address' => 'Kathmandu, Nepal',
                    'phone' => 'Support: +977 1-4510101',
                    'login_label' => 'Patient Login',
                    'login_href' => '/auth/login',
                    'action_buttons' => [
                        [
                            'label' => 'Book Appointment',
                            'href' => '/find-doctors',
                            'variant' => 'primary',
                        ],
                    ],
                ],
                'logo_url' => '/logo.svg',
                'logo_height' => 40,
                'brand_name' => 'Easy Healthcare 101',
                'show_brand_name' => true,
                'links' => [
                    ['label' => 'Video Consult', 'href' => '/telemedicine', 'type' => 'link'],
                    ['label' => 'Find Doctors & Clinics', 'href' => '/find-doctors', 'type' => 'link'],
                    ['label' => 'Health Package', 'href' => '/health-package', 'type' => 'link'],
                    ['label' => 'Easy Pharmacy', 'href' => '/pharmacy', 'type' => 'link'],
                    ['label' => 'Easy Care 365', 'href' => '/easy-care-365', 'type' => 'link'],
                    ['label' => 'Lab Tests', 'href' => '/lab-tests', 'type' => 'link'],
                    ['label' => 'Clinics & Locations', 'href' => '/clinics-locations', 'type' => 'link'],
                    ['label' => 'Our Services', 'href' => '#', 'type' => 'services_dropdown'],
                    ['label' => 'About', 'href' => '#', 'type' => 'about_dropdown'],
                    ['label' => 'Contact', 'href' => '/contact', 'type' => 'link'],
                ],
                'services_menu' => [
                    ['label' => 'Primary Health Care', 'href' => '/primary-health'],
                    ['label' => 'Digital Health & Telemedicine', 'href' => '/telemedicine'],
                    ['label' => 'Diagnostics & Laboratory', 'href' => '/lab-tests'],
                    ['label' => 'Health Package', 'href' => '/health-package'],
                    ['label' => 'Easy Pharmacy', 'href' => '/pharmacy'],
                    ['label' => 'Non-Emergency Medical Transport (NEMT)', 'href' => '/nemt'],
                    ['label' => 'Community Health Programs', 'href' => '/community-health'],
                ],
                'about_menu' => [
                    ['label' => 'About Us', 'href' => '/about', 'desc' => 'Mission, vision, values and our ecosystem.'],
                    ['label' => 'Board of Director', 'href' => '/about/board-of-director', 'desc' => 'Governance, strategy and oversight.'],
                    ['label' => 'Meet the Management', 'href' => '/about/management-team', 'desc' => 'Leadership across operations and innovation.'],
                ],
            ]],
            ['key' => 'communication', 'value' => [
                'mail' => [
                    'enabled' => false,
                    'driver' => 'smtp',
                    'from_name' => '',
                    'from_address' => '',
                    'notify_user_on_signup' => true,
                    'notify_admin_on_signup' => false,
                    'admin_recipients' => '',
                    'host' => '',
                    'port' => 587,
                    'encryption' => 'tls',
                    'username' => '',
                    'password' => '',
                ],
                'sms' => [
                    'enabled' => false,
                    'provider' => 'twilio',
                    'notify_user_on_signup' => false,
                    'notify_admin_on_signup' => false,
                    'admin_numbers' => '',
                    'twilio' => [
                        'account_sid' => '',
                        'auth_token' => '',
                        'from_number' => '',
                    ],
                    'sparrow' => [
                        'api_key' => '',
                        'sender' => '',
                        'base_url' => 'https://api.sparrowsms.com/v2/sms/',
                    ],
                    'other' => [
                        'api_key' => '',
                        'api_secret' => '',
                        'sender' => '',
                        'base_url' => '',
                    ],
                ],
            ]],
            ['key' => 'footer', 'value' => [
            'logo' => '/logo.svg',
            'logo_height' => 48,
            'title' => 'Easy Healthcare 101',
            'description' => 'Providing quality healthcare services to everyone, everywhere.',
            'security_label' => 'HIPAA-aware and privacy-focused',
            'phone' => '+977 1-4510101',
                'email' => 'info@easyhealthcare101.com',
                'address' => 'Kathmandu, Nepal',
                'copyright' => '© 2025 Easy Healthcare 101. All rights reserved.',
            'download_app_title' => 'Download our App',
            'columns' => [
                    [
                        'title' => 'Quick Links',
                        'links' => [
                            ['label' => 'Home', 'url' => '/', 'new_tab' => false],
                            ['label' => 'About Us', 'url' => '/about', 'new_tab' => false],
                            ['label' => 'Contact', 'url' => '/contact', 'new_tab' => false],
                            ['label' => 'Privacy Policy', 'url' => '/privacy', 'new_tab' => false],
                            ['label' => 'Terms of Service', 'url' => '/terms', 'new_tab' => false],
                            ['label' => 'Refund Policy', 'url' => '/refund-policy', 'new_tab' => false],
                        ]
                    ],
                    [
                        'title' => 'Services',
                        'links' => [
                            ['label' => 'Telemedicine', 'url' => '/telemedicine', 'new_tab' => false],
                            ['label' => 'Lab Tests', 'url' => '/lab-tests', 'new_tab' => false],
                            ['label' => 'Easy Pharmacy', 'url' => '/pharmacy', 'new_tab' => false],
                            ['label' => 'Health Package', 'url' => '/health-package', 'new_tab' => false],
                        ]
                    ]
                ],
                'social_links' => [
                    ['platform' => 'facebook', 'url' => 'https://facebook.com'],
                    ['platform' => 'twitter', 'url' => 'https://twitter.com'],
                    ['platform' => 'instagram', 'url' => 'https://instagram.com'],
                    ['platform' => 'linkedin', 'url' => 'https://linkedin.com'],
                ],
                'android_app_link' => 'https://play.google.com/store/apps/details?id=com.easyhealthcare101',
                'ios_app_link' => 'https://apps.apple.com/app/id123456789',
                'newsletter_title' => 'Stay Updated',
                'newsletter_description' => 'Subscribe to our newsletter for latest health tips and updates.',
            ]],

            // Pages: initialize default content blocks for management
            ['key' => 'page.home', 'value' => [
                'title' => 'Home',
                'subtitle' => 'Welcome to Easy Healthcare',
                'sections' => [
                    ['key' => 'hero', 'title' => 'Better Care, Faster', 'content' => 'Discover doctors, tests, and services.'],
                    ['key' => 'highlights', 'title' => 'Highlights', 'content' => 'Top services and specialties.'],
                ],
                'content' => [
                    [
                        'type' => 'pricing_section',
                        'data' => [
                            'title' => 'Simple, Transparent Pricing',
                            'subtitle' => 'Choose the plan that fits your needs',
                            'description' => 'All plans include our core care coordination services.',
                            'plans' => [
                                [
                                    'id' => 'basic',
                                    'name' => 'EasyCare 365 Basic',
                                    'price' => 365,
                                    'period' => '/year',
                                    'description' => 'Essential care coordination for peace of mind.',
                                    'buttonText' => 'Select Basic',
                                    'features' => [
                                        ['text' => 'Annual comprehensive health check-up', 'included' => true],
                                        ['text' => '4 Home health visits per year', 'included' => true],
                                        ['text' => '2 NEMT trips', 'included' => true],
                                        ['text' => 'Dedicated Care Coordinator', 'included' => true],
                                    ],
                                ],
                                [
                                    'id' => 'plus',
                                    'name' => 'EasyCare 365 Plus',
                                    'price' => 499,
                                    'period' => '/year',
                                    'description' => 'Enhanced coverage with more visits and tele-health.',
                                    'highlight' => true,
                                    'buttonText' => 'Select Plus',
                                    'features' => [
                                        ['text' => 'Annual comprehensive health check-up', 'included' => true],
                                        ['text' => '6 Home health visits per year', 'included' => true],
                                        ['text' => '4 NEMT trips', 'included' => true],
                                        ['text' => 'Teleconsultation credits', 'included' => true],
                                    ],
                                ],
                                [
                                    'id' => 'premium',
                                    'name' => 'EasyCare 365 Premium',
                                    'price' => 699,
                                    'period' => '/year',
                                    'description' => 'Complete healthcare management and regular monitoring.',
                                    'buttonText' => 'Select Premium',
                                    'features' => [
                                        ['text' => 'Annual comprehensive health check-up', 'included' => true],
                                        ['text' => 'Monthly nurse visits (12/year)', 'included' => true],
                                        ['text' => '4 NEMT trips', 'included' => true],
                                        ['text' => 'Pharmacy refill service', 'included' => true],
                                    ],
                                ],
                                [
                                    'id' => 'elite',
                                    'name' => 'EasyCare 365 Elite',
                                    'price' => 999,
                                    'period' => '/year',
                                    'description' => 'The ultimate healthcare experience with dedicated concierge.',
                                    'buttonText' => 'Select Elite',
                                    'features' => [
                                        ['text' => 'Annual comprehensive health check-up', 'included' => true],
                                        ['text' => 'Weekly nurse visits (52/year)', 'included' => true],
                                        ['text' => 'Unlimited NEMT trips', 'included' => true],
                                        ['text' => '24/7 Dedicated Medical Concierge', 'included' => true],
                                    ],
                                ],
                            ]
                        ]
                    ],
                    [
                        'type' => 'health_packages_section',
                        'data' => [
                            'title' => 'Health Packages Designed Around Your Life',
                            'subtitle' => 'Browse preventive, family, and chronic-care packages. Simple, clear inclusions and pricing.',
                            'packages' => [
                                [
                                    'id' => 'pkg_basic',
                                    'name' => 'Basic Wellness',
                                    'price' => 2999,
                                    'priceUsd' => 25,
                                    'description' => 'Essential health checkup for young adults.',
                                    'features' => ['CBC', 'Lipid Profile', 'Blood Sugar', 'Urine Routine'],
                                    'is_popular' => false,
                                    'category' => 'Preventive'
                                ],
                                [
                                    'id' => 'pkg_comprehensive',
                                    'name' => 'Comprehensive Care',
                                    'price' => 5999,
                                    'priceUsd' => 45,
                                    'description' => 'Full-body checkup including advanced markers.',
                                    'features' => ['All Basic Features', 'Thyroid Profile', 'Liver Function', 'Kidney Function', 'ECG'],
                                    'is_popular' => true,
                                    'category' => 'Family'
                                ],
                                [
                                    'id' => 'pkg_senior',
                                    'name' => 'Senior Citizen',
                                    'price' => 7999,
                                    'priceUsd' => 60,
                                    'description' => 'Specialized care for seniors.',
                                    'features' => ['All Comprehensive Features', 'Bone Density', 'Vitamin D', 'B12', 'Cardiac Risk Markers'],
                                    'is_popular' => false,
                                    'category' => 'Senior'
                                ],
                                [
                                    'id' => 'pkg_elite',
                                    'name' => 'Executive Health',
                                    'price' => 12999,
                                    'priceUsd' => 99,
                                    'description' => 'Ultimate health assessment with premium tests.',
                                    'features' => ['Full Body Screen', 'HBA1C', 'Iron Profile', 'Calcium', 'Electrolytes', 'Chest X-Ray'],
                                    'is_popular' => false,
                                    'category' => 'Executive'
                                ]
                            ]
                        ]
                    ]
                ]
            ]],
            ['key' => 'page.find-doctors', 'value' => [
                'title' => 'Find Doctors & Clinics',
                'subtitle' => 'Search and book appointments',
                'sections' => [
                    ['key' => 'search', 'title' => 'Find Care', 'content' => 'Search by specialty, location, and availability.'],
                ],
            ]],
            ['key' => 'page.lab-tests', 'value' => [
                'title' => 'Lab Tests',
                'subtitle' => 'Diagnostics & Laboratory',
                'sections' => [
                    ['key' => 'intro', 'title' => 'Accurate Lab Services', 'content' => 'Book tests with transparent pricing.'],
                ],
            ]],
            ['key' => 'page.video-consult', 'value' => [
                'title' => 'Video Consult',
                'subtitle' => 'Talk to doctors online',
                'sections' => [
                    ['key' => 'intro', 'title' => 'Virtual Care', 'content' => 'Convenient consultations from anywhere.'],
                ],
            ]],
            ['key' => 'page.telemedicine', 'value' => [
                'title' => 'Digital Health & Telemedicine',
                'subtitle' => 'Care at your fingertips',
                'sections' => [
                    ['key' => 'intro', 'title' => 'Telemedicine', 'content' => 'Connect with doctors remotely.'],
                ],
            ]],
            ['key' => 'page.easy-pharmacy', 'value' => [
                'title' => 'Easy Pharmacy',
                'subtitle' => 'Affordable medications',
                'sections' => [
                    ['key' => 'intro', 'title' => 'Trusted Pharmacy', 'content' => 'Order medicines with home delivery.'],
                ],
            ]],
            ['key' => 'page.pharmacy', 'value' => [
                'title' => 'Easy Pharmacy',
                'subtitle' => 'Affordable medications',
                'sections' => [
                    ['key' => 'intro', 'title' => 'Trusted Pharmacy', 'content' => 'Order medicines with home delivery.'],
                ],
            ]],
            ['key' => 'page.health-package', 'value' => [
                'title' => 'Health Package',
                'subtitle' => 'Healthcare essentials',
                'sections' => [
                    ['key' => 'catalog', 'title' => 'Product Catalog', 'content' => 'Browse curated health products.'],
                ],
            ]],
            ['key' => 'page.products', 'value' => [
                'title' => 'Health Package',
                'subtitle' => 'Healthcare essentials',
                'sections' => [
                    ['key' => 'catalog', 'title' => 'Product Catalog', 'content' => 'Browse curated health products.'],
                ],
            ]],
            ['key' => 'page.membership', 'value' => [
                'title' => 'Membership',
                'subtitle' => 'Exclusive benefits',
                'sections' => [
                    ['key' => 'tiers', 'title' => 'Plans & Pricing', 'content' => 'Choose a plan that fits you.'],
                ],
            ]],
            ['key' => 'page.clinics-locations', 'value' => [
                'title' => 'Clinics & Locations',
                'subtitle' => 'Find care near you',
                'sections' => [
                    ['key' => 'map', 'title' => 'Our Clinics', 'content' => 'Explore locations and services.'],
                ],
            ]],
            ['key' => 'page.our-services', 'value' => [
                'title' => 'Our Services',
                'subtitle' => 'Comprehensive healthcare',
                'sections' => [
                    ['key' => 'overview', 'title' => 'Service Overview', 'content' => 'Primary care, diagnostics, and more.'],
                ],
            ]],
            ['key' => 'page.services', 'value' => [
                'title' => 'Our Services',
                'subtitle' => 'Comprehensive healthcare',
                'sections' => [
                    ['key' => 'overview', 'title' => 'Service Overview', 'content' => 'Primary care, diagnostics, and more.'],
                ],
            ]],
            ['key' => 'page.about', 'value' => [
                'title' => 'About',
                'subtitle' => 'Our mission and values',
                'sections' => [
                    ['key' => 'story', 'title' => 'Our Story', 'content' => 'Quality care, simplified.'],
                ],
            ]],
            ['key' => 'page.contact', 'value' => [
                'title' => 'Contact',
                'subtitle' => 'Get in touch',
                'sections' => [
                    ['key' => 'form', 'title' => 'Contact Form', 'content' => 'We are here to help.'],
                ],
            ]],
            ['key' => 'page.primary-health-care', 'value' => [
                'title' => 'Primary Health Care',
                'subtitle' => 'Everyday care for families',
                'sections' => [
                    ['key' => 'intro', 'title' => 'Primary Care', 'content' => 'Preventive and routine services.'],
                ],
            ]],
            ['key' => 'page.primary-health', 'value' => [
                'title' => 'Primary Health Care',
                'subtitle' => 'Everyday care for families',
                'sections' => [
                    ['key' => 'intro', 'title' => 'Primary Care', 'content' => 'Preventive and routine services.'],
                ],
            ]],
            ['key' => 'page.digital-health-telemedicine', 'value' => [
                'title' => 'Digital Health & Telemedicine',
                'subtitle' => 'Care at your fingertips',
                'sections' => [
                    ['key' => 'intro', 'title' => 'Telemedicine', 'content' => 'Connect with doctors remotely.'],
                ],
            ]],
            ['key' => 'page.diagnostics-laboratory', 'value' => [
                'title' => 'Diagnostics & Laboratory',
                'subtitle' => 'Accurate testing',
                'sections' => [
                    ['key' => 'tests', 'title' => 'Diagnostics', 'content' => 'Comprehensive lab services.'],
                ],
            ]],
            ['key' => 'page.nemt', 'value' => [
                'title' => 'Non-Emergency Medical Transport (NEMT)',
                'subtitle' => 'Safe transportation',
                'sections' => [
                    ['key' => 'intro', 'title' => 'Transport Services', 'content' => 'Reliable NEMT options.'],
                ],
            ]],
            ['key' => 'page.community-health', 'value' => [
                'title' => 'Community Health Programs',
                'subtitle' => 'Health for all',
                'sections' => [
                    ['key' => 'initiatives', 'title' => 'Programs', 'content' => 'Community outreach and support.'],
                ],
            ]],
            ['key' => 'page.community-health-programs', 'value' => [
                'title' => 'Community Health Programs',
                'subtitle' => 'Health for all',
                'sections' => [
                    ['key' => 'initiatives', 'title' => 'Programs', 'content' => 'Community outreach and support.'],
                ],
            ]],
            ['key' => 'page.website-setting', 'value' => [
                'title' => 'Website Setting',
                'subtitle' => 'Global website configurations',
                'sections' => [
                    ['key' => 'branding', 'title' => 'Branding', 'content' => 'Logo, colors, and typography.'],
                    ['key' => 'seo', 'title' => 'SEO', 'content' => 'Meta tags and social previews.'],
                ],
            ]],
            ['key' => 'page.about-us', 'value' => [
                'title' => 'About Us',
                'subtitle' => 'Who we are',
                'sections' => [
                    ['key' => 'mission', 'title' => 'Mission', 'content' => 'Improve access to quality care.'],
                ],
            ]],
            ['key' => 'page.board-of-director', 'value' => [
                'title' => 'Board of Director',
                'subtitle' => 'Leadership team',
                'members_title' => 'Meet Our Board of Directors',
                'members_description' => 'Guided by experienced leaders committed to healthcare accessibility, quality, and patient satisfaction.',
            ]],
            ['key' => 'page.management-team', 'value' => [
                'title' => 'Meet the Management',
                'subtitle' => 'Executive leadership',
                'sections' => [
                    ['key' => 'members', 'title' => 'Team Members', 'content' => 'Profiles of management team.'],
                ],
            ]],
            // Static content keys
            ['key' => 'home-top-specialties-title', 'value' => 'Top Specialities'],
            ['key' => 'testimonials-title', 'value' => 'What our users have to say'],
            ['key' => 'in-clinic-title', 'value' => 'Book an appointment for an in-clinic consultation'],
            ['key' => 'in-clinic-subtitle', 'value' => 'Find experienced doctors across all specialties.'],
            ['key' => 'doctor-home-visit-title', 'value' => 'Doctor Home Visit'],
            ['key' => 'doctor-home-visit-subtitle', 'value' => 'Get expert medical care at your doorstep.'],
            ['key' => 'download-app-title', 'value' => 'Download our App'],
            ['key' => 'download-app-desc', 'value' => 'Get access to healthcare services on the go.'],
            ['key' => 'download-app-cta', 'value' => 'Download Now'],
            ['key' => 'articles-title', 'value' => 'Health Articles'],
            ['key' => 'articles-subtitle', 'value' => 'Read expert health tips and insights.'],
            ['key' => 'contact-title', 'value' => 'Contact Us'],
            ['key' => 'contact-desc', 'value' => 'We are here to help.'],

            // Dynamic Services
            ['key' => 'service-title-Instant-Video-Consultation', 'value' => 'Instant Video Consultation'],
            ['key' => 'service-desc-Instant-Video-Consultation', 'value' => 'Connect with verified doctors online within 60 seconds from anywhere.'],
            ['key' => 'service-title-Find-Doctors-Near-You', 'value' => 'Find Doctors Near You'],
            ['key' => 'service-desc-Find-Doctors-Near-You', 'value' => 'Discover and book confirmed appointments with highly rated doctors in your vicinity.'],
            ['key' => 'service-title-Surgeries-&-Procedures', 'value' => 'Surgeries & Procedures'],
            ['key' => 'service-desc-Surgeries-&-Procedures', 'value' => 'Access safe and trusted surgery centers for various medical procedures.'],

            // Dynamic Specialists
            ['key' => 'specialist-name-Dentist', 'value' => 'Dentist'],
            ['key' => 'specialist-desc-Dentist', 'value' => 'Teething troubles? Schedule a dental checkup and maintain your oral health.'],
            ['key' => 'specialist-name-Gynecologist/-Obstetrician', 'value' => 'Gynecologist/ Obstetrician'],
            ['key' => 'specialist-desc-Gynecologist/-Obstetrician', 'value' => "Explore services for women's health, pregnancy, and infertility treatments with expert care."],
            ['key' => 'specialist-name-Dietitian/Nutritionist', 'value' => 'Dietitian/Nutritionist'],
            ['key' => 'specialist-desc-Dietitian/Nutritionist', 'value' => 'Get guidance on eating right, effective weight management, and personalized sports nutrition.'],
            ['key' => 'specialist-name-Physiotherapist', 'value' => 'Physiotherapist'],
            ['key' => 'specialist-desc-Physiotherapist', 'value' => 'Pulled a muscle or need rehabilitation? Get it treated by a trained physiotherapist.'],
            ['key' => 'specialist-name-Neurologist', 'value' => 'Neurologist'],
            ['key' => 'specialist-desc-Neurologist', 'value' => 'Specializing in disorders of the nervous system. Expert care for complex conditions.'],
        ];

        foreach ($items as $i) {
            UiSetting::updateOrCreate(['key' => $i['key']], ['value' => $i['value']]);
        }
    }
}
