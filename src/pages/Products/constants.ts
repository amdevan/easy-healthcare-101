import { HealthPackage } from './types';

export const HEALTH_PACKAGES: HealthPackage[] = [
  {
    id: 'pkg_basic',
    name: 'Basic Wellness',
    price: 2999,
    priceUsd: 25,
    description: 'Essential health checkup for young adults.',
    features: ['CBC', 'Lipid Profile', 'Blood Sugar', 'Urine Routine'],
    is_popular: false,
    category: 'Preventive'
  },
  {
    id: 'pkg_comprehensive',
    name: 'Comprehensive Care',
    price: 5999,
    priceUsd: 45,
    description: 'Full-body checkup including advanced markers.',
    features: ['All Basic Features', 'Thyroid Profile', 'Liver Function', 'Kidney Function', 'ECG'],
    is_popular: true,
    category: 'Family'
  },
  {
    id: 'pkg_senior',
    name: 'Senior Citizen',
    price: 7999,
    priceUsd: 60,
    description: 'Specialized care for seniors.',
    features: ['All Comprehensive Features', 'Bone Density', 'Vitamin D', 'B12', 'Cardiac Risk Markers'],
    is_popular: false,
    category: 'Senior'
  },
  {
    id: 'pkg_elite',
    name: 'Executive Health',
    price: 12999,
    priceUsd: 99,
    description: 'Ultimate health assessment with premium tests.',
    features: ['Full Body Screen', 'HBA1C', 'Iron Profile', 'Calcium', 'Electrolytes', 'Chest X-Ray'],
    is_popular: false,
    category: 'Executive'
  }
];

export const ADDITIONAL_SERVICES = [
  'Home Sample Collection',
  'Online Report Delivery',
  'Doctor Consultation',
  'Dietary Advice'
];
