export const defaultMembershipData = {
  id: 0,
  title: 'Easy Care 365',
  slug: 'easy-care-365',
  content: [
    {
      type: 'hero_section',
      data: {
        title: 'Healthcare That Revolves Around You',
        description: 'Join our membership plans for priority access, home visits, and comprehensive care coordination.',
        image: 'https://images.unsplash.com/photo-1576091160550-21733e99db29?auto=format&fit=crop&w=800&q=80',
      },
    },
    {
      type: 'features_section',
      data: {
        title: 'Core Components',
        subtitle: 'What makes our membership unique',
        items: [
          {
            title: 'Preventive & Primary Care',
            description: 'A structured care plan designed to monitor overall health.',
            icon: 'Stethoscope',
            details: [
              'Comprehensive health check-up at partner clinics',
              'Follow-up visits with lab tests',
              'Digital health records maintained & shared'
            ]
          },
          {
            title: 'Medical Logistics Support',
            description: 'End-to-end support for all medical visits and coordination.',
            icon: 'UserCheck',
            details: [
              'Dedicated Care Coordinator',
              'Appointment booking with specialists',
              'Non-Emergency Medical Transport (NEMT)',
              'Medication refill & lab sample collection'
            ]
          },
          {
            title: 'Home Health Visits',
            description: 'Regular wellness monitoring right at home.',
            icon: 'Home',
            details: [
              'Nurse visits for vitals & screening',
              'Medication reviews',
              'Optional physiotherapy & wound care'
            ]
          },
          {
            title: 'Digital Connectivity',
            description: 'Real-time updates and communication platform.',
            icon: 'Smartphone',
            details: [
              'Online dashboard & mobile app',
            ]
          }
        ]
      },
    },
    {
      type: 'testimonials_section',
      data: {
        title: 'Success Stories',
        subtitle: 'Trusted by Families',
        limit: 3,
        testimonials: [
          {
            content: 'Booking an appointment was quick and easy. Highly recommend!',
            author_name: 'Priya S.',
            author_role: 'Patient',
            location: 'Kathmandu',
            rating: 5,
          },
          {
            content: 'Affordable lab tests with home collection. Great service!',
            author_name: 'Rahul K.',
            author_role: 'Patient',
            location: 'Lalitpur',
            rating: 5,
          },
          {
            content: 'The care coordinator kept our family informed every step.',
            author_name: 'Anita M.',
            author_role: 'Family Member',
            location: 'Bhaktapur',
            rating: 5,
          },
          {
            content: 'Regular health monitoring has given us peace of mind.',
            author_name: 'Sunita G.',
            author_role: 'Daughter',
            location: 'Pokhara',
            rating: 5,
          },
        ],
      },
    },
    {
      type: 'value_prop_section',
      data: {
        title: 'Why Families Trust EasyCare 365',
        subtitle: 'Bridging the distance with technology, compassion, and reliable human touch.',
        items: [
          {
            title: 'For the Nepali Diaspora',
            icon: 'Globe',
            points: [
              'Peace of mind with supervised care',
              'Transparent updates on vitals & reports',
              'Trusted healthcare network across Nepal',
              'Comprehensive support for just $1/day'
            ]
          },
          {
            title: 'For Parents in Nepal',
            icon: 'Heart',
            points: [
              'Regular monitoring and early intervention',
              'Comfortable home-based care services',
              'Easy access to hospitals',
              'Compassionate, personalized experience'
            ]
          }
        ]
      },
    },
    {
      type: 'pricing_section',
      data: {
        title: 'Simple, Transparent Pricing',
        subtitle: 'Choose the plan that fits your needs',
        description: 'All plans include our core care coordination services.',
        customPackageTitle: 'Need a Custom Plan?',
        customPackageDescription: 'We can tailor a package to your specific requirements.',
        customPackageButtonText: 'Contact Us',
        plans: [
          {
            id: 'basic',
            name: 'EasyCare 365 Basic',
            price: 365,
            period: '/year',
            description: 'Essential care coordination for peace of mind.',
            buttonText: 'Select Basic',
            features: [
              { text: 'Annual comprehensive health check-up', included: true },
              { text: '4 Home health visits per year', included: true },
              { text: '2 Non-Emergency Transport (NEMT) trips', included: true },
              { text: 'Dedicated Care Coordinator', included: true },
              { text: 'Digital health records dashboard', included: true },
              { text: 'Medication refill management', included: true },
              { text: 'Monthly Nurse Visits', included: false },
              { text: 'Chronic disease monitoring', included: false },
            ],
          },
          {
            id: 'plus',
            name: 'EasyCare 365 Plus',
            price: 499,
            period: '/year',
            description: 'Enhanced coverage with more visits and tele-health.',
            highlight: true,
            buttonText: 'Select Plus',
            features: [
              { text: 'Annual comprehensive health check-up', included: true },
              { text: '6 Home health visits per year', included: true },
              { text: '4 Non-Emergency Transport (NEMT) trips', included: true },
              { text: 'Dedicated Care Coordinator', included: true },
              { text: 'Digital health records dashboard', included: true },
              { text: 'Medication refill management', included: true },
              { text: 'Teleconsultation credits', included: true },
              { text: 'Chronic disease monitoring', included: false },
            ],
          },
          {
            id: 'premium',
            name: 'EasyCare 365 Premium',
            price: 699,
            period: '/year',
            description: 'Complete healthcare management and regular monitoring.',
            buttonText: 'Select Premium',
            features: [
              { text: 'Annual comprehensive health check-up', included: true },
              { text: 'Monthly nurse visits (12/year)', included: true },
              { text: '4 Non-Emergency Transport (NEMT) trips', included: true },
              { text: 'Dedicated Care Manager', included: true },
              { text: 'Digital health records dashboard', included: true },
              { text: 'Pharmacy refill service included', included: true },
              { text: 'Teleconsultation credits', included: true },
              { text: 'Active chronic disease monitoring', included: true },
            ],
          },
          {
            id: 'elite',
            name: 'EasyCare 365 Elite',
            price: 999,
            period: '/year',
            description: 'The ultimate healthcare experience with dedicated concierge.',
            buttonText: 'Select Elite',
            features: [
              { text: 'Annual comprehensive health check-up', included: true },
              { text: 'Weekly nurse visits (52/year)', included: true },
              { text: 'Unlimited NEMT trips', included: true },
              { text: '24/7 Dedicated Medical Concierge', included: true },
              { text: 'Digital health records dashboard', included: true },
              { text: 'Priority pharmacy delivery', included: true },
              { text: 'Unlimited teleconsultations', included: true },
              { text: 'Advanced chronic disease monitoring', included: true },
            ],
          },
        ]
      },
    },
    {
      type: 'faq_section',
      data: {
        title: 'Frequently Asked Questions',
        subtitle: 'Everything you need to know about Easy Care 365.',
        items: [
          {
            question: "How does the 'Dedicated Care Coordinator' work?",
            answer: 'You are assigned a specific Care Coordinator who acts as your primary point of contact. They manage appointments, coordinate with doctors, handle hospital logistics, and update you regularly. You can reach them via WhatsApp or our platform.',
          },
          {
            question: 'Can I add more family members to a plan?',
            answer: 'The standard plans cover one individual. However, we offer discounted add-on rates for spouses or additional family members. Please contact our support team for a custom family quote.',
          },
          {
            question: 'What happens if there is a medical emergency?',
            answer: "In an emergency, our team coordinates immediate ambulance dispatch and hospital admission. While we are not an ambulance service ourselves, our network ensures the fastest possible response, and your Care Coordinator manages the hospital admission process so you don't have to worry about paperwork during a crisis.",
          },
          {
            question: 'Are the home health visits performed by doctors?',
            answer: 'Home health visits are typically conducted by registered nurses (RNs) or health assistants who monitor vitals, review medications, and perform general screenings. Doctor visits can be arranged as an add-on service or if deemed medically necessary during a nurse visit.',
          },
          {
            question: 'Is the subscription refundable?',
            answer: 'We offer a 30-day money-back guarantee if you are not satisfied with our initial service setup. After that, subscriptions are non-refundable but can be transferred to another family member.',
          },
        ],
        cta_text: 'Contact our support team',
        cta_link: '/contact',
      },
    },
  ]
};
